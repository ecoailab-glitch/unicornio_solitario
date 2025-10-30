# 🦄 Sistema de Análisis de Viabilidad de Startups

Sistema fullstack para analizar automáticamente la viabilidad de proyectos de startups usando IA.

## 🏗️ Arquitectura

```
┌─────────────┐
│   Frontend  │ (React + Vite) - localhost:3000
│  (ya existe)│
└──────┬──────┘
       │
       ↓ POST /api/emprendedor
┌─────────────────────┐
│   Backend API       │ (Node.js + Express) - localhost:5000
│   (Express)         │
└──────┬──────────────┘
       │
       ├──→ MongoDB (emprendedor, unicornios)
       │
       ↓ POST /analyze
┌─────────────────────┐
│  IA Analyzer        │ (Python + FastAPI) - localhost:6000
│  (Microservicio)    │
└──┬────────────────┬─┘
   │                │
   ↓                ↓
┌──────────┐  ┌──────────┐
│ Vector DB│  │  Model   │
│ (FAISS)  │  │  Engine  │
│ :7000    │  │  (LLM)   │
│          │  │  :8000   │
└──────────┘  └──────────┘
```

## 🚀 Inicio Rápido

### 1. Requisitos Previos

- **Node.js** >= 18.x
- **Python** >= 3.9
- **MongoDB** >= 5.0 (corriendo en `localhost:27017`)
- **Git**

### 2. Instalación

```bash
# Backend API (Node.js)
cd src/api
npm install
cp .env.example .env

# IA Analyzer (Python)
cd ../services/ia-analyzer
pip install -r requirements.txt
cp .env.example .env

# Vector DB (Python)
cd ../vector-db
pip install -r requirements.txt
cp .env.example .env

# Model Engine (Python)
cd ../../models
pip install -r requirements.txt
cp .env.example .env
```

### 3. Configurar MongoDB

Ya tienes MongoDB configurado con:
- Base de datos: `Unicornio`
- Colección: `emprendedor` (creada automáticamente)
- Colección: `unicornios` (1,305 documentos)

### 4. Construir Índice Vectorial

```bash
# Iniciar Vector DB
cd src/services/vector-db
uvicorn app:app --port 7000

# En otra terminal, construir índice
curl -X POST http://localhost:7000/build-index
```

Esto creará el índice FAISS de los 1,305 unicornios (~30 segundos).

### 5. Cargar Modelo de IA

```bash
# Iniciar Model Engine
cd src/models
uvicorn app:app --port 8000

# En otra terminal, cargar modelo
curl -X POST http://localhost:8000/load-model
```

**Primera vez:** Descargará el modelo (~7GB, 5-15 minutos).

### 6. Iniciar Todos los Servicios

**Terminal 1 - Backend API:**
```bash
cd src/api
npm run dev
```

**Terminal 2 - IA Analyzer:**
```bash
cd src/services/ia-analyzer
uvicorn app:app --port 6000 --reload
```

**Terminal 3 - Vector DB:**
```bash
cd src/services/vector-db
uvicorn app:app --port 7000
```

**Terminal 4 - Model Engine:**
```bash
cd src/models
uvicorn app:app --port 8000
```

**Terminal 5 - Frontend (ya lo tienes):**
```bash
npm run dev
```

## 🔗 URLs de Servicios

| Servicio      | URL                     | Descripción                    |
|---------------|-------------------------|--------------------------------|
| Frontend      | http://localhost:3000   | Interfaz web (React)           |
| Backend API   | http://localhost:5000   | API REST principal             |
| IA Analyzer   | http://localhost:6000   | Microservicio de análisis      |
| Vector DB     | http://localhost:7000   | Búsqueda semántica             |
| Model Engine  | http://localhost:8000   | Motor de generación de texto   |

## 📋 Flujo Completo

### 1. Usuario completa formulario en el frontend

```javascript
POST http://localhost:3000/registro
```

### 2. Frontend envía datos al backend

```javascript
POST http://localhost:5000/api/emprendedor
{
  "nombre": "Juan",
  "correo": "juan@example.com",
  "proyecto": {
    "nombre": "EcoApp",
    "descripcion": "Plataforma de sostenibilidad",
    "sector": "CleanTech",
    "etapa": "mvp"
  },
  ...
}
```

### 3. Backend guarda en MongoDB y lanza análisis

```javascript
// Guardar emprendedor
const emprendedor = await emprendedorModel.crear(datos);

// Lanzar análisis (en segundo plano)
axios.post('http://localhost:6000/analyze', {
  emprendedorId: emprendedor._id
});
```

### 4. IA Analyzer procesa el análisis

```python
# 1. Buscar emprendedor en MongoDB
emprendedor = db.emprendedor.find_one({"_id": emprendedorId})

# 2. Buscar proyectos similares (Vector DB)
similares = requests.post('http://localhost:7000/search', {
  "query": emprendedor.proyecto.descripcion,
  "top_k": 5
})

# 3. Construir prompt con contexto
prompt = construir_prompt(emprendedor, similares)

# 4. Generar análisis (Model Engine)
analisis = requests.post('http://localhost:8000/generate', {
  "prompt": prompt
})

# 5. Guardar informe en MongoDB
db.emprendedor.update_one(
  {"_id": emprendedorId},
  {"$set": {"informe": informe}}
)
```

### 5. Frontend consulta el informe

```javascript
GET http://localhost:5000/api/informe/:id

// Respuesta
{
  "viabilidad": 78,
  "valorMercado": 5000000,
  "proyectosSimilares": [...],
  "recomendaciones": [...],
  "pivotesSugeridos": [...],
  ...
}
```

## 🧪 Testing del Sistema

```bash
# 1. Health checks
curl http://localhost:5000/health
curl http://localhost:6000/health
curl http://localhost:7000/health
curl http://localhost:8000/health

# 2. Crear emprendedor y lanzar análisis
curl -X POST http://localhost:5000/api/emprendedor \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellidos": "User",
    "correo": "test@example.com",
    "usuario": "testuser",
    "contrasena": "password123",
    "pais": "México",
    "proyecto": {
      "nombre": "TestApp",
      "descripcion": "Una aplicación de comercio electrónico para PyMEs",
      "sector": "E-commerce",
      "etapa": "mvp"
    }
  }'

# Respuesta incluye el _id del emprendedor
# {"success":true,"data":{"_id":"67a1b2c3d4e5f6g7h8i9j0k1",...}}

# 3. Consultar estado del informe (esperar ~30-60 segundos)
curl http://localhost:5000/api/informe/67a1b2c3d4e5f6g7h8i9j0k1
```

## 📊 Estructura de Carpetas

```
unicornio_solitario/
├── src/
│   ├── api/                          # Backend API (Node.js)
│   │   ├── server.js                 # Punto de entrada
│   │   ├── config/database.js        # Conexión MongoDB
│   │   ├── models/Emprendedor.js     # Modelo de datos
│   │   ├── controllers/              # Lógica de negocio
│   │   ├── routes/                   # Rutas API
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── services/
│   │   ├── ia-analyzer/              # Microservicio de análisis (Python)
│   │   │   ├── app.py
│   │   │   ├── requirements.txt
│   │   │   └── README.md
│   │   │
│   │   └── vector-db/                # Búsqueda vectorial (Python)
│   │       ├── app.py
│   │       ├── requirements.txt
│   │       └── README.md
│   │
│   ├── models/                       # Model Engine (Python)
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── README.md
│   │
│   └── [frontend ya existe]
│
├── package.json                      # Frontend (Vite + React)
└── README.md                         # Este archivo
```

## 🔧 Configuración Opcional

### Cambiar Modelo de IA

Edita `src/models/.env`:

```env
# Ligero (CPU, ~1GB RAM)
MODEL_NAME=HuggingFaceTB/SmolLM2-135M-Instruct

# Balanceado (recomendado, ~7GB RAM)
MODEL_NAME=microsoft/Phi-3-mini-4k-instruct

# Potente (GPU, ~14GB VRAM)
MODEL_NAME=mistralai/Mistral-7B-Instruct-v0.2
```

### Usar GPU

Edita `src/models/.env`:

```env
DEVICE=cuda
```

Y reinstala PyTorch con CUDA:

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

## 🐛 Troubleshooting

### "Error: No se puede conectar a MongoDB"

```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no está corriendo, iniciarlo
mongod
```

### "Error: Vector DB no responde"

```bash
# Verificar que el servicio esté corriendo
curl http://localhost:7000/health

# Si no hay índice, construirlo
curl -X POST http://localhost:7000/build-index
```

### "Error: Model Engine lento o no responde"

```bash
# Verificar estado del modelo
curl http://localhost:8000/health

# Cargar modelo si no está cargado
curl -X POST http://localhost:8000/load-model

# Usar modelo más ligero si es muy lento (edita src/models/.env)
MODEL_NAME=HuggingFaceTB/SmolLM2-135M-Instruct
```

### "Error: Puerto ya en uso"

```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :5000

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

## 📈 Monitoreo

### Ver logs en tiempo real:

**Backend API:**
```bash
cd src/api
npm run dev
# Verás logs de solicitudes y análisis lanzados
```

**IA Analyzer:**
```bash
cd src/services/ia-analyzer
uvicorn app:app --port 6000 --reload
# Verás logs de análisis en progreso
```

### Verificar estado de análisis en MongoDB:

```bash
mongosh

use Unicornio

# Ver emprendedores con informe pendiente
db.emprendedor.find({"informe.estado": "pendiente"})

# Ver emprendedores con informe completado
db.emprendedor.find({"informe.estado": "completado"})
```

## 🚢 Despliegue en Producción

### Consideraciones:

1. **Autenticación**: Agrega JWT al backend API
2. **HTTPS**: Usa certificados SSL
3. **Rate Limiting**: Limita solicitudes por IP
4. **Validación**: Usa Joi/Zod para validar datos
5. **Passwords**: Hashea con bcrypt
6. **Docker**: Containeriza cada servicio
7. **Logs**: Usa Winston/Pino
8. **Monitoreo**: Implementa healthchecks

### Docker Compose (ejemplo):

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
  
  backend-api:
    build: ./src/api
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
  
  ia-analyzer:
    build: ./src/services/ia-analyzer
    ports:
      - "6000:6000"
  
  vector-db:
    build: ./src/services/vector-db
    ports:
      - "7000:7000"
  
  model-engine:
    build: ./src/models
    ports:
      - "8000:8000"
```

## 📝 Notas Finales

- El sistema funciona **sin GPU**, pero es más lento
- El análisis tarda 30-90 segundos según el modelo
- Los informes se guardan automáticamente en MongoDB
- El frontend puede consultar el estado con polling
- Todos los servicios tienen fallbacks inteligentes
- Compatible con cualquier modelo de HuggingFace

## 🆘 Soporte

Para problemas o dudas:
1. Revisa los logs de cada servicio
2. Verifica los health checks
3. Consulta los README de cada módulo
4. Revisa la documentación de FastAPI y Express

## 📚 Documentación Adicional

- [Backend API](./src/api/README.md)
- [IA Analyzer](./src/services/ia-analyzer/README.md)
- [Vector DB](./src/services/vector-db/README.md)
- [Model Engine](./src/models/README.md)
