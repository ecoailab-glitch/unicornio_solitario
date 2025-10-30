# Unicornio Solitario

## Arquitectura del Proyecto

El proyecto está estructurado como una Single Page Application (SPA) utilizando React y sigue una arquitectura modular basada en componentes. La estructura principal del proyecto es:

```
src/
├── components/     # Componentes reutilizables
├── contexts/       # Contextos de React para gestión de estado
├── lib/           # Utilidades y servicios
└── pages/         # Componentes de página/rutas
```

## Tecnologías Principales

- **Frontend:**
  - React 18.2.0
  - Vite 4.4.5 (bundler)
  - TailwindCSS 3.3.3
  - React Router 6.16.0
  - Radix UI (componentes de interfaz)
  - Framer Motion (animaciones)

- **Backend/Base de Datos:**
  - Supabase (Backend as a Service)
  - Local Storage (almacenamiento local)

## Integración con Base de Datos (Supabase)

### Configuración
```javascript
const supabaseUrl = 'https://vybvkstbpbdetfnfawtq.supabase.co';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
```

### Operaciones CRUD

#### Create (Crear)
```javascript
const createItem = async (table, data) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert([data])
    .select();
  
  if (error) throw error;
  return result;
};
```

#### Read (Leer)
```javascript
const getItems = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) throw error;
  return data;
};

const getItemById = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};
```

#### Update (Actualizar)
```javascript
const updateItem = async (table, id, data) => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return result;
};
```

#### Delete (Eliminar)
```javascript
const deleteItem = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
```

### Almacenamiento Local
El proyecto también utiliza localStorage como respaldo y para datos temporales:

```javascript
// Guardar datos
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Recuperar datos
const loadData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
```

## Notas Importantes
- La base de datos actual está configurada en Supabase y se utilizará para almacenar datos persistentes.
- El almacenamiento local se utiliza como respaldo y para datos temporales de la sesión.
- Las operaciones CRUD están centralizadas para facilitar su modificación y mantenimiento.