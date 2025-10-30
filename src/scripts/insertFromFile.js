import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script para leer unicornios desde archivo e insertarlos
 * Ejecutar con: node src/scripts/insertFromFile.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'unicornios';

// Ruta al archivo de datos (puede ser JSON o CSV)
const DATA_FILE = join(__dirname, '..', 'data', 'unicornios.json');

async function insertFromFile() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('📂 Leyendo archivo de datos...');
    
    // Leer el archivo
    let unicornios = [];
    
    try {
      const fileContent = readFileSync(DATA_FILE, 'utf-8');
      unicornios = JSON.parse(fileContent);
      console.log(`✅ Archivo leído: ${unicornios.length} registros encontrados\n`);
    } catch (error) {
      console.error('❌ Error al leer el archivo:', error.message);
      console.log('\n💡 Asegúrate de que existe el archivo: src/data/unicornios.json');
      console.log('   El archivo debe ser un array JSON con los datos de los unicornios.\n');
      process.exit(1);
    }
    
    // Conectar a MongoDB
    await client.connect();
    console.log('✅ Conectado a MongoDB\n');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`📝 Insertando ${unicornios.length} unicornios...\n`);
    
    let insertados = 0;
    let duplicados = 0;
    let errores = 0;
    
    // Bucle para recorrer e insertar cada registro
    for (let i = 0; i < unicornios.length; i++) {
      const unicornio = unicornios[i];
      
      try {
        // Agregar timestamps si no existen
        if (!unicornio.createdAt) {
          unicornio.createdAt = new Date();
        }
        if (!unicornio.updatedAt) {
          unicornio.updatedAt = new Date();
        }
        
        // Insertar el registro
        await collection.insertOne(unicornio);
        
        console.log(`✅ [${i + 1}/${unicornios.length}] ${unicornio.nombre} - ${unicornio.pais} ($${(unicornio.valoracion / 1000000000).toFixed(1)}B)`);
        insertados++;
        
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  [${i + 1}/${unicornios.length}] ${unicornio.nombre} - Ya existe (duplicado)`);
          duplicados++;
        } else {
          console.error(`❌ [${i + 1}/${unicornios.length}] Error al insertar ${unicornio.nombre}:`, error.message);
          errores++;
        }
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Insertados exitosamente: ${insertados}`);
    console.log(`   ⚠️  Duplicados (ya existían): ${duplicados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📦 Total procesados: ${unicornios.length}`);
    
    // Mostrar total de unicornios en la BD
    const total = await collection.countDocuments();
    console.log(`\n🦄 Total de unicornios en la base de datos: ${total}`);
    
    // Estadísticas adicionales
    console.log('\n📈 Estadísticas:');
    
    // Por país
    const porPais = await collection.aggregate([
      { $group: { _id: '$pais', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    console.log('\n🌍 Top 5 países:');
    porPais.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item._id}: ${item.cantidad} unicornios`);
    });
    
    // Por sector
    const porSector = await collection.aggregate([
      { $group: { _id: '$sector', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    console.log('\n💼 Top 5 sectores:');
    porSector.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item._id}: ${item.cantidad} unicornios`);
    });
    
    // Valoración total
    const valoracionTotal = await collection.aggregate([
      { $group: { _id: null, total: { $sum: '$valoracion' } } }
    ]).toArray();
    
    if (valoracionTotal.length > 0) {
      const totalB = valoracionTotal[0].total / 1000000000;
      console.log(`\n💰 Valoración total del ecosistema: $${totalB.toFixed(1)}B`);
    }
    
    console.log('\n✅ Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔒 Conexión cerrada');
  }
}

// Ejecutar
insertFromFile()
  .then(() => {
    console.log('\n🎉 ¡Importación completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
