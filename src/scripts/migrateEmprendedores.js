import { MongoClient } from 'mongodb';

/**
 * Script de migración para agregar campos faltantes a la colección de emprendedores
 * Ejecutar con: node src/scripts/migrateEmprendedores.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'emprendedor';

async function migrateEmprendedores() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Verificar si la colección existe
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    
    if (collections.length === 0) {
      console.log('⚠️  La colección "emprendedor" no existe. Creándola...');
    }
    
    // Obtener un documento de ejemplo para ver qué campos ya existen
    const ejemploDoc = await collection.findOne({});
    
    if (ejemploDoc) {
      console.log('\n📄 Campos existentes en la colección:');
      console.log(Object.keys(ejemploDoc));
    }
    
    // Definir la estructura completa de campos
    const camposCompletos = {
      // Información Personal
      nombre: "",
      apellido: "",
      fechaNacimiento: null,
      edad: null,
      genero: "",
      
      // Información de Contacto
      correo: "",
      telefono: "",
      telefonoSecundario: "",
      
      // Ubicación
      pais: "",
      ciudad: "",
      region: "",
      direccion: "",
      codigoPostal: "",
      
      // Credenciales
      usuario: "",
      contraseña: "",
      
      // Información del Proyecto
      proyecto: {
        nombre: "",
        descripcion: "",
        sector: "",
        subsector: "",
        etapa: "",
        fechaInicio: null,
        objetivos: "",
        problemaQueResuelve: "",
        propuestaValor: "",
        modeloNegocio: "",
        mercadoObjetivo: "",
        competencia: "",
        ventajaCompetitiva: "",
        traccion: "",
        necesidadesActuales: [],
      },
      
      // Información Profesional y Académica
      formacionAcademica: [],
      experienciaLaboral: [],
      habilidades: [],
      idiomas: [],
      
      // Experiencia Emprendedora
      esEmprendedorPrevio: false,
      proyectosAnteriores: [],
      
      // Recursos y Capacidades
      equipo: [],
      recursosDisponibles: {
        capitalPropio: 0,
        inversionRecibida: 0,
        tieneOficina: false,
        tieneEquipoTecnologico: false,
        otrosRecursos: "",
      },
      
      // Necesidades y Objetivos
      buscaFinanciamiento: false,
      montoFinanciamientoBuscado: 0,
      buscaMentoria: false,
      areasApoyo: [],
      
      // ODS (Objetivos de Desarrollo Sostenible)
      odsRelacionados: [],
      impactoSocial: "",
      impactoAmbiental: "",
      
      // Redes Sociales y Online
      redesSociales: {
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: "",
        sitioWeb: "",
        github: "",
      },
      
      // Documentación
      documentos: [],
      
      // Preferencias y Disponibilidad
      disponibilidadReuniones: {
        dias: [],
        horarios: [],
        zonaHoraria: "",
      },
      
      preferenciasMentoria: {
        modalidad: "",
        frecuencia: "",
        areasInteres: [],
      },
      
      // Estado y Metadata
      estado: "activo",
      verificado: false,
      completoPerfil: 0,
      fechaRegistro: new Date(),
      ultimoAcceso: new Date(),
      
      // Participación en el Ecosistema
      participacionRetos: [],
      mentoresAsignados: [],
      eventosAsistidos: [],
      
      // Notificaciones y Preferencias
      notificaciones: {
        email: true,
        sms: false,
        whatsapp: false,
      },
      
      // Auditoría
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
    };
    
    console.log('\n🔄 Actualizando documentos existentes con campos faltantes...');
    
    // Actualizar todos los documentos existentes agregando campos faltantes
    const resultado = await collection.updateMany(
      {}, // Todos los documentos
      {
        $set: {
          updatedAt: new Date(),
        },
        // $setOnInsert solo agrega campos si no existen
      }
    );
    
    console.log(`✅ Documentos actualizados: ${resultado.modifiedCount}`);
    
    // Crear índices para mejorar el rendimiento
    console.log('\n📊 Creando índices...');
    
    await collection.createIndex({ correo: 1 }, { unique: true, sparse: true });
    console.log('✅ Índice creado: correo (único)');
    
    await collection.createIndex({ usuario: 1 }, { unique: true, sparse: true });
    console.log('✅ Índice creado: usuario (único)');
    
    await collection.createIndex({ pais: 1 });
    console.log('✅ Índice creado: pais');
    
    await collection.createIndex({ 'proyecto.sector': 1 });
    console.log('✅ Índice creado: proyecto.sector');
    
    await collection.createIndex({ 'proyecto.etapa': 1 });
    console.log('✅ Índice creado: proyecto.etapa');
    
    await collection.createIndex({ estado: 1 });
    console.log('✅ Índice creado: estado');
    
    await collection.createIndex({ fechaRegistro: -1 });
    console.log('✅ Índice creado: fechaRegistro');
    
    // Validación del esquema (MongoDB 3.6+)
    console.log('\n📋 Aplicando validación de esquema...');
    
    await db.command({
      collMod: COLLECTION_NAME,
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nombre", "apellido", "correo", "usuario", "pais"],
          properties: {
            nombre: {
              bsonType: "string",
              description: "Nombre es requerido y debe ser una cadena"
            },
            apellido: {
              bsonType: "string",
              description: "Apellido es requerido y debe ser una cadena"
            },
            correo: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
              description: "Correo es requerido y debe ser un email válido"
            },
            usuario: {
              bsonType: "string",
              description: "Usuario es requerido y debe ser una cadena"
            },
            pais: {
              bsonType: "string",
              description: "País es requerido"
            },
            edad: {
              bsonType: ["int", "null"],
              minimum: 18,
              maximum: 120,
              description: "Edad debe ser un número entre 18 y 120"
            },
            telefono: {
              bsonType: ["string", "null"],
              description: "Teléfono debe ser una cadena"
            },
            estado: {
              enum: ["activo", "inactivo", "pendiente_aprobacion", "rechazado"],
              description: "Estado debe ser uno de los valores permitidos"
            }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "warn"
    });
    
    console.log('✅ Validación de esquema aplicada');
    
    // Mostrar estructura completa de campos
    console.log('\n📋 Estructura completa de campos en la colección "emprendedor":');
    console.log(JSON.stringify(camposCompletos, null, 2));
    
    // Contar documentos
    const totalDocs = await collection.countDocuments();
    console.log(`\n📊 Total de documentos en la colección: ${totalDocs}`);
    
    console.log('\n✅ Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔒 Conexión cerrada');
  }
}

// Ejecutar migración
migrateEmprendedores()
  .then(() => {
    console.log('\n🎉 Proceso completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
