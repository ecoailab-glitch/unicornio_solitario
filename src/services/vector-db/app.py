from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import pickle
from pathlib import Path

load_dotenv()

app = FastAPI(
    title="Vector DB Service",
    description="Servicio de búsqueda vectorial semántica para unicornios",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/Unicornio")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
VECTOR_INDEX_PATH = os.getenv("VECTOR_INDEX_PATH", "./vector_index")

# Modelo de embeddings
print(f"📦 Cargando modelo de embeddings: {EMBEDDING_MODEL_NAME}...")
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
print("✅ Modelo cargado")

# MongoDB
client = MongoClient(MONGODB_URI)
db_name = MONGODB_URI.split('/')[-1].split('?')[0]
db = client[db_name]
unicornios_col = db['unicornios']

# Variables globales para el índice
faiss_index = None
unicornios_data = []
embeddings_cache = None


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class IndexResponse(BaseModel):
    success: bool
    message: str
    total_documents: int
    embedding_dim: int


class SearchResult(BaseModel):
    nombre: str
    sector: str
    pais: str
    valoracion: float
    etapa: str
    descripcion: str
    similarity: float


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_found: int


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    
    index_status = "Loaded" if faiss_index is not None else "Not initialized"
    
    return {
        "status": "OK",
        "message": "Vector DB funcionando correctamente",
        "embedding_model": EMBEDDING_MODEL_NAME,
        "index_status": index_status,
        "indexed_documents": len(unicornios_data)
    }


@app.post("/build-index", response_model=IndexResponse)
async def build_vector_index():
    """
    Construye el índice vectorial desde MongoDB.
    Lee todos los unicornios, genera embeddings y crea índice FAISS.
    """
    
    global faiss_index, unicornios_data, embeddings_cache
    
    try:
        print("🔨 Construyendo índice vectorial...")
        
        # 1. Leer todos los unicornios de MongoDB
        unicornios = list(unicornios_col.find({}))
        
        if not unicornios:
            raise HTTPException(status_code=404, detail="No hay unicornios en la base de datos")
        
        print(f"📚 Encontrados {len(unicornios)} unicornios")
        
        # 2. Preparar textos para embedding
        textos = []
        unicornios_data = []
        
        for unicornio in unicornios:
            # Crear texto descriptivo
            nombre = unicornio.get('nombre', '')
            sector = unicornio.get('sector', '')
            descripcion = unicornio.get('descripcion', '')
            pais = unicornio.get('pais', '')
            
            texto = f"{nombre} {sector} {descripcion} {pais}"
            textos.append(texto)
            
            # Guardar datos del unicornio
            unicornios_data.append({
                "id": str(unicornio.get('_id')),
                "nombre": nombre,
                "sector": sector,
                "pais": pais,
                "valoracion": unicornio.get('valoracion', 0),
                "etapa": unicornio.get('etapa', 'unicornio'),
                "descripcion": descripcion
            })
        
        # 3. Generar embeddings
        print("🧠 Generando embeddings...")
        embeddings = embedding_model.encode(textos, show_progress_bar=True)
        embeddings_cache = embeddings
        
        # 4. Crear índice FAISS
        print("📊 Creando índice FAISS...")
        dimension = embeddings.shape[1]
        
        # Usar IndexFlatIP para búsqueda por similitud de coseno
        faiss_index = faiss.IndexFlatIP(dimension)
        
        # Normalizar embeddings para usar producto interno como similitud de coseno
        faiss.normalize_L2(embeddings)
        
        # Agregar embeddings al índice
        faiss_index.add(embeddings)
        
        print(f"✅ Índice construido: {len(unicornios_data)} documentos, dimensión {dimension}")
        
        # 5. Guardar índice en disco (opcional)
        Path(VECTOR_INDEX_PATH).mkdir(parents=True, exist_ok=True)
        
        faiss.write_index(faiss_index, f"{VECTOR_INDEX_PATH}/index.faiss")
        
        with open(f"{VECTOR_INDEX_PATH}/metadata.pkl", "wb") as f:
            pickle.dump(unicornios_data, f)
        
        with open(f"{VECTOR_INDEX_PATH}/embeddings.pkl", "wb") as f:
            pickle.dump(embeddings_cache, f)
        
        print(f"💾 Índice guardado en {VECTOR_INDEX_PATH}")
        
        return {
            "success": True,
            "message": "Índice vectorial construido exitosamente",
            "total_documents": len(unicornios_data),
            "embedding_dim": dimension
        }
    
    except Exception as e:
        print(f"❌ Error construyendo índice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al construir índice: {str(e)}")


@app.post("/search", response_model=SearchResponse)
async def search_similar_projects(request: SearchRequest):
    """
    Busca proyectos similares usando búsqueda vectorial semántica.
    """
    
    global faiss_index, unicornios_data
    
    try:
        # Verificar que el índice esté construido
        if faiss_index is None or not unicornios_data:
            print("⚠️ Índice no construido, construyendo automáticamente...")
            await build_vector_index()
        
        if faiss_index is None:
            raise HTTPException(status_code=503, detail="Índice vectorial no disponible")
        
        # 1. Generar embedding de la query
        query_embedding = embedding_model.encode([request.query])
        
        # Normalizar para usar producto interno como similitud de coseno
        faiss.normalize_L2(query_embedding)
        
        # 2. Buscar en el índice
        k = min(request.top_k, len(unicornios_data))
        similarities, indices = faiss_index.search(query_embedding, k)
        
        # 3. Preparar resultados
        results = []
        
        for idx, similarity in zip(indices[0], similarities[0]):
            if idx < len(unicornios_data):
                unicornio = unicornios_data[idx]
                
                results.append(SearchResult(
                    nombre=unicornio['nombre'],
                    sector=unicornio['sector'],
                    pais=unicornio['pais'],
                    valoracion=unicornio['valoracion'],
                    etapa=unicornio['etapa'],
                    descripcion=unicornio['descripcion'],
                    similarity=float(similarity)
                ))
        
        print(f"🔎 Búsqueda completada: {len(results)} resultados para '{request.query[:50]}...'")
        
        return SearchResponse(
            query=request.query,
            results=results,
            total_found=len(results)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en búsqueda: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en búsqueda: {str(e)}")


@app.post("/load-index")
async def load_saved_index():
    """
    Carga un índice previamente guardado desde disco.
    """
    
    global faiss_index, unicornios_data, embeddings_cache
    
    try:
        index_file = f"{VECTOR_INDEX_PATH}/index.faiss"
        metadata_file = f"{VECTOR_INDEX_PATH}/metadata.pkl"
        embeddings_file = f"{VECTOR_INDEX_PATH}/embeddings.pkl"
        
        if not Path(index_file).exists():
            raise HTTPException(status_code=404, detail="No hay índice guardado. Usa /build-index primero.")
        
        print("📂 Cargando índice desde disco...")
        
        # Cargar índice FAISS
        faiss_index = faiss.read_index(index_file)
        
        # Cargar metadata
        with open(metadata_file, "rb") as f:
            unicornios_data = pickle.load(f)
        
        # Cargar embeddings
        with open(embeddings_file, "rb") as f:
            embeddings_cache = pickle.load(f)
        
        print(f"✅ Índice cargado: {len(unicornios_data)} documentos")
        
        return {
            "success": True,
            "message": "Índice cargado exitosamente",
            "total_documents": len(unicornios_data)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error cargando índice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al cargar índice: {str(e)}")


@app.on_event("startup")
async def startup_event():
    """Se ejecuta al iniciar el servidor"""
    
    print("🚀 Iniciando Vector DB Service...")
    
    # Intentar cargar índice guardado
    try:
        if Path(f"{VECTOR_INDEX_PATH}/index.faiss").exists():
            await load_saved_index()
        else:
            print("ℹ️ No hay índice guardado. Usa /build-index para crear uno.")
    except Exception as e:
        print(f"⚠️ No se pudo cargar índice guardado: {e}")


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando Vector DB Service...")
    print(f"📍 MongoDB: {MONGODB_URI}")
    print(f"📍 Modelo: {EMBEDDING_MODEL_NAME}")
    uvicorn.run(app, host="0.0.0.0", port=7000, reload=False)  # reload=False para mantener índice en memoria
