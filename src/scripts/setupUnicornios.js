import { MongoClient } from 'mongodb';

/**
 * Script para configurar la tabla unicornios e insertar registros iniciales
 * Ejecutar con: node src/scripts/setupUnicornios.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'unicornios';

// Datos de ejemplo de unicornios
const unicorniosIniciales = [
  {
    nombre: "TechVision AI",
    fundador: "María González",
    añoFundacion: 2020,
    valoracion: 1200000000, // $1.2B
    sector: "Inteligencia Artificial",
    subsector: "Machine Learning",
    pais: "España",
    ciudad: "Barcelona",
    descripcion: "Plataforma de IA para automatización empresarial",
    empleados: 450,
    rondaFinanciamiento: "Serie C",
    inversionTotal: 250000000,
    inversoresPrincipales: ["Sequoia Capital", "Andreessen Horowitz"],
    etapa: "unicornio",
    ingresoAnual: 85000000,
    crecimientoAnual: 125,
    impactoSocial: "Digitalización de PYMEs en Latinoamérica",
    odsRelacionados: [8, 9],
    tecnologias: ["Python", "TensorFlow", "AWS"],
    clientesPrincipales: ["Banco Santander", "Telefónica", "BBVA"],
    premios: ["Best AI Startup 2024", "Tech Innovation Award"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "GreenEnergy Solutions",
    fundador: "Carlos Ramírez",
    añoFundacion: 2019,
    valoracion: 1500000000, // $1.5B
    sector: "Energía Renovable",
    subsector: "Solar",
    pais: "México",
    ciudad: "Ciudad de México",
    descripcion: "Infraestructura de energía solar para hogares y empresas",
    empleados: 680,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 380000000,
    inversoresPrincipales: ["Softbank", "Tiger Global"],
    etapa: "unicornio",
    ingresoAnual: 120000000,
    crecimientoAnual: 95,
    impactoSocial: "Reducción de emisiones de CO2 en 2 millones de toneladas anuales",
    odsRelacionados: [7, 13],
    tecnologias: ["IoT", "Blockchain", "AI"],
    clientesPrincipales: ["Walmart México", "CEMEX", "Grupo Bimbo"],
    premios: ["Green Tech Leader 2024", "Climate Action Award"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "HealthTech Plus",
    fundador: "Ana Martínez",
    añoFundacion: 2021,
    valoracion: 1800000000, // $1.8B
    sector: "Salud Digital",
    subsector: "Telemedicina",
    pais: "Colombia",
    ciudad: "Bogotá",
    descripcion: "Plataforma integral de telemedicina y diagnóstico con IA",
    empleados: 520,
    rondaFinanciamiento: "Serie C",
    inversionTotal: 320000000,
    inversoresPrincipales: ["Google Ventures", "Accel Partners"],
    etapa: "unicornio",
    ingresoAnual: 95000000,
    crecimientoAnual: 150,
    impactoSocial: "Atención médica a 5 millones de personas en zonas rurales",
    odsRelacionados: [3, 10],
    tecnologias: ["React Native", "Python", "TensorFlow", "Azure"],
    clientesPrincipales: ["Ministerio de Salud", "Sanitas", "Sura"],
    premios: ["Digital Health Innovation 2024", "Latin America Startup of the Year"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "EduFuture",
    fundador: "Roberto Silva",
    añoFundacion: 2018,
    valoracion: 2100000000, // $2.1B
    sector: "EdTech",
    subsector: "Educación Online",
    pais: "Argentina",
    ciudad: "Buenos Aires",
    descripcion: "Plataforma de educación personalizada con IA para Latinoamérica",
    empleados: 750,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 450000000,
    inversoresPrincipales: ["Naspers", "Prosus", "IFC"],
    etapa: "unicornio",
    ingresoAnual: 140000000,
    crecimientoAnual: 110,
    impactoSocial: "Educación de calidad para 8 millones de estudiantes",
    odsRelacionados: [4, 10],
    tecnologias: ["Vue.js", "Node.js", "MongoDB", "AWS"],
    clientesPrincipales: ["Ministerio de Educación Argentina", "Universidad de Buenos Aires"],
    premios: ["EdTech Award 2024", "Innovation in Education"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "FinPro",
    fundador: "Laura Fernández",
    añoFundacion: 2020,
    valoracion: 3500000000, // $3.5B
    sector: "FinTech",
    subsector: "Pagos Digitales",
    pais: "Chile",
    ciudad: "Santiago",
    descripcion: "Solución de pagos digitales y banca móvil para no bancarizados",
    empleados: 920,
    rondaFinanciamiento: "Serie E",
    inversionTotal: 680000000,
    inversoresPrincipales: ["Sequoia Capital", "Goldman Sachs", "PayPal Ventures"],
    etapa: "decacornio",
    ingresoAnual: 280000000,
    crecimientoAnual: 85,
    impactoSocial: "Inclusión financiera de 12 millones de personas",
    odsRelacionados: [1, 8, 10],
    tecnologias: ["Kotlin", "Swift", "Blockchain", "AWS"],
    clientesPrincipales: ["Falabella", "Cencosud", "Ripley"],
    premios: ["FinTech of the Year 2024", "Financial Inclusion Award"],
    estado: "activo",
    cotizaBolsa: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function setupUnicornios() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Verificar documentos existentes
    const existentes = await collection.countDocuments();
    console.log(`📊 Documentos existentes: ${existentes}`);
    
    if (existentes > 0) {
      console.log('\n⚠️  Ya existen documentos. ¿Desea continuar? (se agregarán más registros)');
      // En un ambiente real, aquí pedirías confirmación
    }
    
    // Insertar datos iniciales
    console.log('\n📝 Insertando registros de unicornios...');
    const resultado = await collection.insertMany(unicorniosIniciales);
    console.log(`✅ Insertados ${resultado.insertedCount} unicornios`);
    
    // Crear índices
    console.log('\n📊 Creando índices...');
    
    await collection.createIndex({ nombre: 1 }, { unique: true, name: 'nombre' });
    console.log('✅ Índice creado: nombre (único)');
    
    await collection.createIndex({ sector: 1 }, { name: 'sector' });
    console.log('✅ Índice creado: sector');
    
    await collection.createIndex({ pais: 1 }, { name: 'pais' });
    console.log('✅ Índice creado: pais');
    
    await collection.createIndex({ valoracion: -1 }, { name: 'valoracion' });
    console.log('✅ Índice creado: valoracion (descendente)');
    
    await collection.createIndex({ añoFundacion: 1 }, { name: 'anioFundacion' });
    console.log('✅ Índice creado: añoFundacion');
    
    await collection.createIndex({ estado: 1 }, { name: 'estado' });
    console.log('✅ Índice creado: estado');
    
    await collection.createIndex({ etapa: 1 }, { name: 'etapa' });
    console.log('✅ Índice creado: etapa');
    
    // Aplicar validación de esquema
    console.log('\n📋 Aplicando validación de esquema...');
    
    await db.command({
      collMod: COLLECTION_NAME,
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nombre", "fundador", "añoFundacion", "valoracion", "sector", "pais"],
          properties: {
            nombre: {
              bsonType: "string",
              description: "Nombre del unicornio es requerido"
            },
            fundador: {
              bsonType: "string",
              description: "Fundador es requerido"
            },
            añoFundacion: {
              bsonType: "int",
              minimum: 2000,
              maximum: 2030,
              description: "Año de fundación debe estar entre 2000 y 2030"
            },
            valoracion: {
              bsonType: ["int", "long", "double"],
              minimum: 1000000000,
              description: "Valoración debe ser al menos 1 billón (unicornio)"
            },
            sector: {
              bsonType: "string",
              description: "Sector es requerido"
            },
            pais: {
              bsonType: "string",
              description: "País es requerido"
            },
            empleados: {
              bsonType: ["int", "null"],
              minimum: 0,
              description: "Número de empleados debe ser positivo"
            },
            estado: {
              enum: ["activo", "adquirido", "cerrado", "ipo"],
              description: "Estado debe ser uno de los valores permitidos"
            },
            etapa: {
              enum: ["unicornio", "decacornio", "hectocornio"],
              description: "Etapa según valoración: unicornio ($1B+), decacornio ($10B+), hectocornio ($100B+)"
            }
          }
        }
      },
      validationLevel: "moderate",
      validationAction: "warn"
    });
    
    console.log('✅ Validación de esquema aplicada');
    
    // Mostrar resumen
    console.log('\n📊 Resumen de unicornios insertados:');
    const unicornios = await collection.find({}).toArray();
    unicornios.forEach((u, index) => {
      console.log(`\n${index + 1}. ${u.nombre}`);
      console.log(`   Fundador: ${u.fundador}`);
      console.log(`   País: ${u.pais}`);
      console.log(`   Valoración: $${(u.valoracion / 1000000000).toFixed(1)}B`);
      console.log(`   Sector: ${u.sector}`);
      console.log(`   Empleados: ${u.empleados}`);
    });
    
    console.log('\n✅ Configuración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

// Ejecutar configuración
setupUnicornios()
  .then(() => {
    console.log('\n🎉 Proceso completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
