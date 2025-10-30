# 🚀 API Backend - Unicornio Solitario

Backend principal del sistema de análisis de viabilidad de startups.

## 📦 Instalación

```bash
cd src/api
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Unicornio
IA_ANALYZER_URL=http://localhost:6000
NODE_ENV=development
```

## 🚀 Ejecución

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📡 Endpoints

### **Emprendedores**

#### `POST /api/emprendedor`
Crear nuevo emprendedor y lanzar análisis automático.

**Body:**
```json
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "correo": "juan@example.com",
  "usuario": "juanperez",
  "contrasena": "password123",
  "pais": "México",
  "proyecto": {
    "nombre": "EcoApp",
    "descripcion": "Plataforma de sostenibilidad para empresas",
    "sector": "CleanTech",
    "etapa": "mvp"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emprendedor creado exitosamente. El análisis de IA se está procesando.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan",
    ...
  }
}
```

#### `GET /api/emprendedor`
Listar emprendedores con filtros y paginación.

**Query params:**
- `pagina` (default: 1)
- `limite` (default: 10)
- `sector` (opcional)
- `etapa` (opcional)
- `pais` (opcional)

**Response:**
```json
{
  "success": true,
  "emprendedores": [...],
  "paginacion": {
    "total": 50,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 5
  }
}
```

#### `GET /api/emprendedor/:id`
Obtener un emprendedor por ID.

#### `PUT /api/emprendedor/:id`
Actualizar datos de un emprendedor.

#### `DELETE /api/emprendedor/:id`
Eliminar un emprendedor.

---

### **Informes**

#### `GET /api/informe/:id`
Obtener el informe de análisis de IA.

**Posibles estados:**
- **202 Accepted**: Informe pendiente o procesando
- **200 OK**: Informe completado
- **500 Error**: Error en la generación

**Response (completado):**
```json
{
  "success": true,
  "data": {
    "emprendedor": {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Juan Pérez",
      "proyecto": "EcoApp",
      "sector": "CleanTech"
    },
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
      "fechaAnalisis": "2025-10-30T12:00:00.000Z",
      "estado": "completado"
    }
  }
}
```

#### `POST /api/informe/:id/regenerar`
Regenerar el informe de análisis.

---

## 🔧 Arquitectura

```
src/api/
├── server.js              # Punto de entrada
├── config/
│   └── database.js        # Conexión a MongoDB
├── models/
│   └── Emprendedor.js     # Modelo de datos
├── controllers/
│   ├── emprendedor.controller.js
│   └── informe.controller.js
├── routes/
│   ├── emprendedor.routes.js
│   └── informe.routes.js
└── package.json
```

## 🔗 Integración con IA

Cuando se crea un emprendedor:
1. Se guarda en MongoDB
2. Se responde al cliente inmediatamente
3. En segundo plano, se hace `POST http://localhost:6000/analyze`
4. El microservicio de IA procesa y guarda el informe

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Crear emprendedor
curl -X POST http://localhost:5000/api/emprendedor \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellidos": "User",
    "correo": "test@example.com",
    "usuario": "testuser",
    "contrasena": "password",
    "pais": "España",
    "proyecto": {
      "nombre": "TestApp",
      "descripcion": "App de prueba",
      "sector": "Tech",
      "etapa": "idea"
    }
  }'

# Obtener informe
curl http://localhost:5000/api/informe/<id>
```

## 📝 Notas

- Las contraseñas deben hashearse en producción (usar bcrypt)
- Agregar autenticación JWT para endpoints protegidos
- Implementar rate limiting para prevenir abuso
- Validar datos de entrada con librerías como Joi o Zod
