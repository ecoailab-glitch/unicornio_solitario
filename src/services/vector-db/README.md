# 🔍 Vector DB Service - Búsqueda Semántica

Servicio de búsqueda vectorial para encontrar unicornios similares usando embeddings.

## 📦 Instalación

```bash
cd src/services/vector-db
pip install -r requirements.txt
```

En la primera ejecución, descargará el modelo `all-MiniLM-L6-v2` (~80MB).

## ⚙️ Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/Unicornio
EMBEDDING_MODEL=all-MiniLM-L6-v2
VECTOR_INDEX_PATH=./vector_index
ENVIRONMENT=development
```

## 🚀 Ejecución

```bash
# Desde src/services/vector-db/
uvicorn app:app --port 7000
```

**⚠️ Importante**: No uses `--reload` en producción, para mantener el índice en memoria.

El servicio estará disponible en: `http://localhost:7000`

## 📡 Endpoints

### `GET /health`
Health check del servicio.

**Response:**
```json
{
  "status": "OK",
  "message": "Vector DB funcionando correctamente",
  "embedding_model": "all-MiniLM-L6-v2",
  "index_status": "Loaded",
  "indexed_documents": 1305
}
```

### `POST /build-index`
Construye el índice vectorial desde MongoDB.

**Cuándo usar:**
- Primera vez que inicias el servicio
- Cuando agregues nuevos unicornios a MongoDB
- Para actualizar el índice con datos recientes

**Response:**
```json
{
  "success": true,
  "message": "Índice vectorial construido exitosamente",
  "total_documents": 1305,
  "embedding_dim": 384
}
```

**Tiempo estimado:** ~30 segundos para 1,000 documentos.

### `POST /search`
Busca proyectos similares por similitud semántica.

**Body:**
```json
{
  "query": "Plataforma de delivery de alimentos con inteligencia artificial",
  "top_k": 5
}
```

**Response:**
```json
{
  "query": "Plataforma de delivery de alimentos...",
  "results": [
    {
      "nombre": "Rappi",
      "sector": "Delivery",
      "pais": "Colombia",
      "valoracion": 5200000000,
      "etapa": "unicornio",
      "descripcion": "...",
      "similarity": 0.87
    },
    {
      "nombre": "DoorDash",
      "sector": "Delivery",
      "pais": "United States",
      "valoracion": 72000000000,
      "etapa": "decacornio",
      "descripcion": "...",
      "similarity": 0.82
    }
  ],
  "total_found": 5
}
```

**Similarity score:**
- `0.9 - 1.0`: Muy similar
- `0.7 - 0.9`: Similar
- `0.5 - 0.7`: Moderadamente similar
- `< 0.5`: Poco similar

### `POST /load-index`
Carga un índice previamente guardado desde disco.

Útil para reiniciar el servicio sin reconstruir el índice.

## 🔧 Cómo Funciona

### 1. Construcción del índice:

```
MongoDB (unicornios) → Textos → Embeddings → FAISS Index
```

- Lee todos los unicornios de MongoDB
- Para cada uno, crea un texto: `nombre + sector + descripción + país`
- Genera embeddings usando `all-MiniLM-L6-v2` (384 dimensiones)
- Crea un índice FAISS para búsqueda rápida
- Guarda en disco para cargas futuras

### 2. Búsqueda:

```
Query → Embedding → FAISS Search → Top K Results
```

- Convierte la query en embedding
- Busca en el índice FAISS usando similitud de coseno
- Retorna los K resultados más similares con scores

## 📊 Modelo de Embeddings

**all-MiniLM-L6-v2** (Sentence Transformers):
- ✅ Ligero: ~80MB
- ✅ Rápido: ~1000 embeddings/segundo en CPU
- ✅ Buena calidad para búsqueda semántica
- ✅ Multilenguaje (incluye español)
- 📏 Dimensiones: 384

**Alternativas:**
- `paraphrase-multilingual-MiniLM-L12-v2` (más precisión)
- `distiluse-base-multilingual-cased-v2` (mejor multilenguaje)

## 🧪 Testing

```bash
# Health check
curl http://localhost:7000/health

# Construir índice
curl -X POST http://localhost:7000/build-index

# Buscar similares
curl -X POST http://localhost:7000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "aplicación de comercio electrónico para pequeñas empresas",
    "top_k": 5
  }'
```

## 💾 Persistencia

El índice se guarda automáticamente en `./vector_index/`:
- `index.faiss`: Índice FAISS
- `metadata.pkl`: Datos de los unicornios
- `embeddings.pkl`: Cache de embeddings

Al reiniciar el servicio, carga automáticamente el índice guardado.

## 🚀 Optimización

**Para grandes volúmenes (>100K documentos):**

1. Cambiar a `IndexIVFFlat` en lugar de `IndexFlatIP`
2. Usar GPU con `faiss-gpu`
3. Implementar búsqueda aproximada (ANN)

**Ejemplo con IVF:**
```python
quantizer = faiss.IndexFlatIP(dimension)
faiss_index = faiss.IndexIVFFlat(quantizer, dimension, 100)  # 100 clusters
faiss_index.train(embeddings)
faiss_index.add(embeddings)
```

## 📝 Notas

- El índice se mantiene en memoria para búsquedas rápidas
- Reconstruye el índice cuando agregues nuevos unicornios
- Compatible con CPU y GPU (cambia `faiss-cpu` por `faiss-gpu`)
- Escalable a millones de documentos con configuraciones avanzadas
