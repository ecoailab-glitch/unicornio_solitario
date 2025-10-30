import { MongoClient } from 'mongodb';

/**
 * Script para limpiar y recrear índices sin el sufijo _1
 * Ejecutar con: node src/scripts/cleanIndexes.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'emprendedor';

async function cleanIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Listar índices actuales
    console.log('\n📋 Índices actuales:');
    const indexesActuales = await collection.indexes();
    indexesActuales.forEach(index => {
      console.log(`  - ${index.name}`);
    });
    
    // Eliminar índices con _1 (excepto _id que es el índice por defecto)
    console.log('\n🗑️  Eliminando índices antiguos...');
    
    const indicesAEliminar = [
      'correo_1',
      'usuario_1',
      'pais_1',
      'proyecto.sector_1',
      'proyecto.etapa_1',
      'estado_1',
      'fechaRegistro_-1'
    ];
    
    for (const indexName of indicesAEliminar) {
      try {
        await collection.dropIndex(indexName);
        console.log(`  ✓ Eliminado: ${indexName}`);
      } catch (error) {
        if (error.codeName === 'IndexNotFound') {
          console.log(`  ⚠️  No encontrado: ${indexName}`);
        } else {
          console.log(`  ❌ Error al eliminar ${indexName}:`, error.message);
        }
      }
    }
    
    // Crear índices nuevos con nombres limpios
    console.log('\n✨ Creando índices limpios...');
    
    await collection.createIndex({ correo: 1 }, { unique: true, sparse: true, name: 'correo' });
    console.log('  ✓ Índice creado: correo (único)');
    
    await collection.createIndex({ usuario: 1 }, { unique: true, sparse: true, name: 'usuario' });
    console.log('  ✓ Índice creado: usuario (único)');
    
    await collection.createIndex({ pais: 1 }, { name: 'pais' });
    console.log('  ✓ Índice creado: pais');
    
    await collection.createIndex({ 'proyecto.sector': 1 }, { name: 'proyecto_sector' });
    console.log('  ✓ Índice creado: proyecto.sector');
    
    await collection.createIndex({ 'proyecto.etapa': 1 }, { name: 'proyecto_etapa' });
    console.log('  ✓ Índice creado: proyecto.etapa');
    
    await collection.createIndex({ estado: 1 }, { name: 'estado' });
    console.log('  ✓ Índice creado: estado');
    
    await collection.createIndex({ fechaRegistro: -1 }, { name: 'fechaRegistro' });
    console.log('  ✓ Índice creado: fechaRegistro (descendente)');
    
    // Listar índices finales
    console.log('\n📋 Índices finales:');
    const indexesFinales = await collection.indexes();
    indexesFinales.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ Índices limpiados y recreados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

// Ejecutar limpieza
cleanIndexes()
  .then(() => {
    console.log('\n🎉 Proceso completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
