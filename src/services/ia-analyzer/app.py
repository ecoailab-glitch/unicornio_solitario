from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import requests
from pymongo import MongoClient
from bson import ObjectId
import json
from datetime import datetime

load_dotenv()

app = FastAPI(
    title="IA Analyzer",
    description="Microservicio de análisis de viabilidad de startups",
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
VECTOR_DB_URL = os.getenv("VECTOR_DB_URL", "http://localhost:7000")
MODEL_ENGINE_URL = os.getenv("MODEL_ENGINE_URL", "http://localhost:8000")

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db_name = MONGODB_URI.split('/')[-1].split('?')[0]
db = client[db_name]
emprendedores_col = db['emprendedor']
unicornios_col = db['unicornios']

print(f"✅ Conectado a MongoDB: {db_name}")


class AnalyzeRequest(BaseModel):
    emprendedorId: str


class HealthResponse(BaseModel):
    status: str
    message: str
    services: dict


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    
    services_status = {
        "mongodb": "OK",
        "vector_db": "Unknown",
        "model_engine": "Unknown"
    }
    
    # Check MongoDB
    try:
        client.admin.command('ping')
        services_status["mongodb"] = "OK"
    except Exception as e:
        services_status["mongodb"] = f"Error: {str(e)}"
    
    # Check Vector DB
    try:
        response = requests.get(f"{VECTOR_DB_URL}/health", timeout=2)
        services_status["vector_db"] = "OK" if response.status_code == 200 else "Error"
    except:
        services_status["vector_db"] = "Offline"
    
    # Check Model Engine
    try:
        response = requests.get(f"{MODEL_ENGINE_URL}/health", timeout=2)
        services_status["model_engine"] = "OK" if response.status_code == 200 else "Error"
    except:
        services_status["model_engine"] = "Offline"
    
    return {
        "status": "OK",
        "message": "IA Analyzer funcionando correctamente",
        "services": services_status
    }


@app.post("/analyze")
async def analyze_startup(request: AnalyzeRequest):
    """
    Analiza la viabilidad de un proyecto de startup.
    
    Proceso:
    1. Busca los datos del emprendedor en MongoDB
    2. Llama al servicio de búsqueda vectorial para encontrar unicornios similares
    3. Construye un prompt con el contexto
    4. Llama al modelo de IA para generar el informe
    5. Guarda el resultado en MongoDB
    """
    
    try:
        emprendedor_id = request.emprendedorId
        print(f"\n🔍 Iniciando análisis para emprendedor: {emprendedor_id}")
        
        # 1. Buscar datos del emprendedor
        emprendedor = emprendedores_col.find_one({"_id": ObjectId(emprendedor_id)})
        
        if not emprendedor:
            raise HTTPException(status_code=404, detail="Emprendedor no encontrado")
        
        print(f"✅ Emprendedor encontrado: {emprendedor.get('nombre')} - Proyecto: {emprendedor.get('proyecto', {}).get('nombre')}")
        
        # 2. Buscar proyectos similares usando el servicio vectorial
        print("🔎 Buscando proyectos similares...")
        
        proyecto_descripcion = emprendedor.get('proyecto', {}).get('descripcion', '')
        proyecto_sector = emprendedor.get('proyecto', {}).get('sector', '')
        
        # Construir query para búsqueda vectorial
        query_text = f"{proyecto_descripcion} {proyecto_sector}"
        
        try:
            vector_response = requests.post(
                f"{VECTOR_DB_URL}/search",
                json={"query": query_text, "top_k": 5},
                timeout=30
            )
            
            if vector_response.status_code == 200:
                proyectos_similares = vector_response.json().get("results", [])
                print(f"✅ Encontrados {len(proyectos_similares)} proyectos similares")
            else:
                print("⚠️ Error en búsqueda vectorial, usando fallback")
                proyectos_similares = buscar_similares_fallback(proyecto_sector)
        
        except Exception as e:
            print(f"⚠️ Vector DB no disponible: {e}, usando fallback")
            proyectos_similares = buscar_similares_fallback(proyecto_sector)
        
        # 3. Construir prompt para el modelo
        print("📝 Construyendo prompt para el modelo...")
        
        prompt = construir_prompt(emprendedor, proyectos_similares)
        
        # 4. Llamar al modelo de IA
        print("🤖 Llamando al modelo de IA...")
        
        try:
            model_response = requests.post(
                f"{MODEL_ENGINE_URL}/generate",
                json={"prompt": prompt},
                timeout=60
            )
            
            if model_response.status_code == 200:
                analisis_texto = model_response.json().get("response", "")
                print("✅ Análisis generado por el modelo")
            else:
                print("⚠️ Error en modelo, usando análisis básico")
                analisis_texto = generar_analisis_basico(emprendedor, proyectos_similares)
        
        except Exception as e:
            print(f"⚠️ Model Engine no disponible: {e}, usando análisis básico")
            analisis_texto = generar_analisis_basico(emprendedor, proyectos_similares)
        
        # 5. Parsear y estructurar el informe
        informe = estructurar_informe(analisis_texto, emprendedor, proyectos_similares)
        
        # 6. Guardar informe en MongoDB
        print("💾 Guardando informe en MongoDB...")
        
        emprendedores_col.update_one(
            {"_id": ObjectId(emprendedor_id)},
            {
                "$set": {
                    "informe": informe,
                    "ultimaActualizacion": datetime.now()
                }
            }
        )
        
        print(f"✅ Análisis completado para {emprendedor_id}")
        
        return {
            "success": True,
            "message": "Análisis completado exitosamente",
            "emprendedorId": emprendedor_id,
            "informe": informe
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en análisis: {str(e)}")
        
        # Marcar como error en MongoDB
        try:
            emprendedores_col.update_one(
                {"_id": ObjectId(emprendedor_id)},
                {
                    "$set": {
                        "informe.estado": "error",
                        "informe.error": str(e),
                        "ultimaActualizacion": datetime.now()
                    }
                }
            )
        except:
            pass
        
        raise HTTPException(status_code=500, detail=f"Error en el análisis: {str(e)}")


def buscar_similares_fallback(sector: str, limite: int = 5):
    """Fallback: buscar unicornios por sector en MongoDB"""
    
    query = {}
    if sector:
        query["sector"] = {"$regex": sector, "$options": "i"}
    
    unicornios = list(unicornios_col.find(query).limit(limite))
    
    return [
        {
            "nombre": u.get("nombre", "Desconocido"),
            "sector": u.get("sector", ""),
            "pais": u.get("pais", ""),
            "valoracion": u.get("valoracion", 0),
            "etapa": u.get("etapa", "unicornio"),
            "descripcion": u.get("descripcion", ""),
            "similarity": 0.5  # Valor por defecto
        }
        for u in unicornios
    ]


def construir_prompt(emprendedor: dict, proyectos_similares: list) -> str:
    """Construye el prompt para el modelo de IA"""
    
    proyecto = emprendedor.get('proyecto', {})
    
    prompt = f"""Eres un experto analista de startups y venture capital. Analiza el siguiente proyecto de startup:

**PROYECTO A ANALIZAR:**
- Nombre: {proyecto.get('nombre', 'N/A')}
- Sector: {proyecto.get('sector', 'N/A')}
- Etapa: {proyecto.get('etapa', 'N/A')}
- País: {emprendedor.get('pais', 'N/A')}
- Descripción: {proyecto.get('descripcion', 'N/A')}
- Problema que resuelve: {proyecto.get('problemaQueResuelve', 'N/A')}
- Solución propuesta: {proyecto.get('solucionPropuesta', 'N/A')}

**EMPRESAS SIMILARES EXITOSAS (Unicornios):**
"""
    
    for i, similar in enumerate(proyectos_similares[:5], 1):
        prompt += f"""
{i}. {similar.get('nombre', 'N/A')} ({similar.get('pais', 'N/A')})
   - Sector: {similar.get('sector', 'N/A')}
   - Valoración: ${similar.get('valoracion', 0):,.0f} USD
   - Similitud: {similar.get('similarity', 0) * 100:.1f}%
"""
    
    prompt += """

**TAREA:**
Genera un análisis estructurado con los siguientes elementos:

1. **VIABILIDAD** (0-100%): Porcentaje de viabilidad del proyecto considerando mercado, competencia y factores clave.

2. **VALOR DE MERCADO ESTIMADO** (USD): Proyección del valor potencial en 3-5 años.

3. **FORTALEZAS** (lista de 3-5 puntos): Aspectos positivos del proyecto.

4. **DEBILIDADES** (lista de 3-5 puntos): Áreas de mejora o riesgos.

5. **OPORTUNIDADES** (lista de 3-5 puntos): Tendencias y oportunidades del mercado.

6. **AMENAZAS** (lista de 3-5 puntos): Riesgos externos y competencia.

7. **RECOMENDACIONES** (lista de 3-5 acciones): Pasos concretos para aumentar la viabilidad.

8. **PIVOTES SUGERIDOS** (lista de 2-3 opciones): Posibles pivotes estratégicos si es necesario.

9. **ANÁLISIS COMPLETO** (2-3 párrafos): Resumen ejecutivo del proyecto.

Responde en formato JSON válido con esta estructura:
{
  "viabilidad": <número 0-100>,
  "valorMercado": <número en USD>,
  "fortalezas": ["punto 1", "punto 2", ...],
  "debilidades": ["punto 1", "punto 2", ...],
  "oportunidades": ["punto 1", "punto 2", ...],
  "amenazas": ["punto 1", "punto 2", ...],
  "recomendaciones": ["acción 1", "acción 2", ...],
  "pivotesSugeridos": ["pivote 1", "pivote 2", ...],
  "analisisCompleto": "texto del análisis..."
}
"""
    
    return prompt


def generar_analisis_basico(emprendedor: dict, proyectos_similares: list) -> str:
    """Genera un análisis básico cuando el modelo no está disponible"""
    
    proyecto = emprendedor.get('proyecto', {})
    sector = proyecto.get('sector', 'Tecnología')
    etapa = proyecto.get('etapa', 'idea')
    
    # Calcular viabilidad básica
    viabilidad = 50  # Base
    
    if etapa in ['mvp', 'lanzamiento']:
        viabilidad += 15
    elif etapa in ['crecimiento', 'escalado']:
        viabilidad += 25
    
    if len(proyectos_similares) > 0:
        viabilidad += 10
    
    if proyecto.get('descripcion') and len(proyecto.get('descripcion', '')) > 100:
        viabilidad += 5
    
    # Estimar valor de mercado basado en similares
    if proyectos_similares:
        valores = [p.get('valoracion', 0) for p in proyectos_similares]
        valor_promedio = sum(valores) / len(valores) if valores else 1000000
        valor_mercado = int(valor_promedio * 0.1)  # 10% del promedio
    else:
        valor_mercado = 5000000  # $5M por defecto
    
    analisis = {
        "viabilidad": min(viabilidad, 95),
        "valorMercado": valor_mercado,
        "fortalezas": [
            f"Proyecto en sector {sector} con potencial de crecimiento",
            f"Etapa {etapa} adecuada para el desarrollo",
            "Idea innovadora con enfoque claro"
        ],
        "debilidades": [
            "Necesita validación de mercado más profunda",
            "Requiere desarrollo de plan financiero detallado",
            "Falta información sobre competencia directa"
        ],
        "oportunidades": [
            f"Mercado {sector} en expansión global",
            "Posibilidad de escalamiento internacional",
            "Tendencias favorables en el sector"
        ],
        "amenazas": [
            "Alta competencia en el mercado",
            "Cambios regulatorios potenciales",
            "Necesidad de inversión significativa"
        ],
        "recomendaciones": [
            "Validar el problema con usuarios reales",
            "Desarrollar MVP funcional lo antes posible",
            "Buscar mentores en el sector",
            "Crear pitch deck profesional",
            "Identificar early adopters"
        ],
        "pivotesSugeridos": [
            "Enfocarse en un nicho específico del mercado",
            f"Explorar modelo B2B en lugar de B2C para {sector}",
            "Considerar partnerships estratégicos con empresas establecidas"
        ],
        "analisisCompleto": f"El proyecto '{proyecto.get('nombre', 'Sin nombre')}' presenta una viabilidad del {min(viabilidad, 95)}% en su etapa actual ({etapa}). El sector {sector} muestra oportunidades interesantes, especialmente considerando las tendencias actuales del mercado. Se recomienda enfocarse en la validación del problema y desarrollo del MVP para aumentar las probabilidades de éxito. El valor de mercado estimado en 3-5 años es de ${valor_mercado:,.0f} USD, basado en comparables del sector y proyecciones de crecimiento."
    }
    
    return json.dumps(analisis, ensure_ascii=False)


def estructurar_informe(analisis_texto: str, emprendedor: dict, proyectos_similares: list) -> dict:
    """Estructura el informe final a partir del texto del modelo"""
    
    try:
        # Intentar parsear como JSON
        if isinstance(analisis_texto, str):
            # Limpiar el texto
            analisis_texto = analisis_texto.strip()
            
            # Extraer JSON si está dentro de markdown code blocks
            if "```json" in analisis_texto:
                analisis_texto = analisis_texto.split("```json")[1].split("```")[0].strip()
            elif "```" in analisis_texto:
                analisis_texto = analisis_texto.split("```")[1].split("```")[0].strip()
            
            analisis_data = json.loads(analisis_texto)
        else:
            analisis_data = analisis_texto
    
    except json.JSONDecodeError:
        # Si no es JSON válido, usar análisis básico
        analisis_data = json.loads(generar_analisis_basico(emprendedor, proyectos_similares))
    
    # Estructurar informe final
    informe = {
        "viabilidad": analisis_data.get("viabilidad", 50),
        "valorMercado": analisis_data.get("valorMercado", 5000000),
        "proyectosSimilares": [
            {
                "nombre": p.get("nombre", ""),
                "sector": p.get("sector", ""),
                "pais": p.get("pais", ""),
                "valoracion": p.get("valoracion", 0),
                "similitud": round(p.get("similarity", 0) * 100, 1)
            }
            for p in proyectos_similares[:5]
        ],
        "recomendaciones": analisis_data.get("recomendaciones", []),
        "pivotesSugeridos": analisis_data.get("pivotesSugeridos", []),
        "fortalezas": analisis_data.get("fortalezas", []),
        "debilidades": analisis_data.get("debilidades", []),
        "oportunidades": analisis_data.get("oportunidades", []),
        "amenazas": analisis_data.get("amenazas", []),
        "analisisCompleto": analisis_data.get("analisisCompleto", ""),
        "fechaAnalisis": datetime.now(),
        "estado": "completado"
    }
    
    return informe


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando IA Analyzer...")
    print(f"📍 MongoDB: {MONGODB_URI}")
    print(f"📍 Vector DB: {VECTOR_DB_URL}")
    print(f"📍 Model Engine: {MODEL_ENGINE_URL}")
    uvicorn.run(app, host="0.0.0.0", port=6000, reload=True)
