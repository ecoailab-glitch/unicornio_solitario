# 🤖 IA Analyzer - Microservicio de Análisis

Microservicio Python que analiza la viabilidad de proyectos de startups usando IA.

## 📦 Instalación

```bash
cd src/services/ia-analyzer
pip install -r requirements.txt
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/Unicornio
VECTOR_DB_URL=http://localhost:7000
MODEL_ENGINE_URL=http://localhost:8000
ENVIRONMENT=development
```

## 🚀 Ejecución

```bash
# Desde src/services/ia-analyzer/
uvicorn app:app --port 6000 --reload
```

El servicio estará disponible en: `http://localhost:6000`

## 📡 Endpoints

### `GET /health`
Health check del servicio y sus dependencias.

**Response:**
```json
{
  "status": "OK",
  "message": "IA Analyzer funcionando correctamente",
  "services": {
    "mongodb": "OK",
    "vector_db": "OK",
    "model_engine": "OK"
  }
}
```

### `POST /analyze`
Analiza un proyecto de startup.

**Body:**
```json
{
  "emprendedorId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Análisis completado exitosamente",
  "emprendedorId": "507f1f77bcf86cd799439011",
  "informe": {
    "viabilidad": 78,
    "valorMercado": 5000000,
    "proyectosSimilares": [...],
    "recomendaciones": [...],
    "pivotesSugeridos": [...],
    "fortalezas": [...],
    "debilidades": [...],
    "oportunidades": [...],
    "amenazas": [...],
    "analisisCompleto": "...",
    "fechaAnalisis": "2025-10-30T12:00:00",
    "estado": "completado"
  }
}
```

## 🔧 Arquitectura

### Flujo de análisis:

1. **Recibe solicitud** con `emprendedorId`
2. **Busca datos** del emprendedor en MongoDB
3. **Llama a Vector DB** para encontrar proyectos similares
4. **Construye prompt** con contexto del emprendedor + unicornios similares
5. **Llama al Model Engine** para generar el análisis
6. **Estructura el informe** en formato JSON
7. **Guarda el resultado** en MongoDB (`emprendedor.informe`)

### Fallback inteligente:

Si los servicios de Vector DB o Model Engine no están disponibles:
- **Vector DB offline**: Busca similares por sector directamente en MongoDB
- **Model Engine offline**: Genera un análisis básico con reglas heurísticas

Esto garantiza que el sistema **siempre** entregue un informe, incluso sin los servicios avanzados.

## 🔗 Dependencias

- **MongoDB**: Base de datos principal
- **Vector DB** (puerto 7000): Búsqueda semántica de proyectos similares
- **Model Engine** (puerto 8000): Generación de texto con IA

## 🧪 Testing

```bash
# Health check
curl http://localhost:6000/health

# Analizar proyecto (necesitas un _id válido de MongoDB)
curl -X POST http://localhost:6000/analyze \
  -H "Content-Type: application/json" \
  -d '{"emprendedorId": "507f1f77bcf86cd799439011"}'
```

## 📊 Estructura del Informe Generado

```json
{
  "viabilidad": 78,
  "valorMercado": 5000000,
  "proyectosSimilares": [
    {
      "nombre": "Rappi",
      "sector": "Delivery",
      "pais": "Colombia",
      "valoracion": 5200000000,
      "similitud": 87.3
    }
  ],
  "recomendaciones": [
    "Validar el problema con usuarios reales",
    "Desarrollar MVP funcional",
    "Buscar mentores en el sector"
  ],
  "pivotesSugeridos": [
    "Enfocarse en un nicho específico",
    "Explorar modelo B2B"
  ],
  "fortalezas": ["...", "..."],
  "debilidades": ["...", "..."],
  "oportunidades": ["...", "..."],
  "amenazas": ["...", "..."],
  "analisisCompleto": "Texto del análisis completo...",
  "fechaAnalisis": "2025-10-30T12:00:00",
  "estado": "completado"
}
```

## 📝 Notas

- El servicio maneja errores gracefully con fallbacks
- Los análisis se guardan automáticamente en MongoDB
- Compatible con cualquier modelo de LLM (Phi-4, SmolLM2, GPT, etc.)
- Escalable y listo para producción con Docker
