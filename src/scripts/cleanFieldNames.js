import { MongoClient } from 'mongodb';

/**
 * Script para renombrar campos que terminan en _1
 * Ejecutar con: node src/scripts/cleanFieldNames.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'emprendedor';

async function cleanFieldNames() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Obtener todos los documentos
    const documentos = await collection.find({}).toArray();
    console.log(`📄 Documentos encontrados: ${documentos.length}`);
    
    if (documentos.length === 0) {
      console.log('⚠️  No hay documentos para procesar');
      return;
    }
    
    // Mapeo de nombres antiguos a nuevos
    const renombramientos = {
      'correo_1': 'correo',
      'usuario_1': 'usuario',
      'pais_1': 'pais',
      'proyecto.sector_1': 'sector',
      'proyecto.etapa_1': 'etapa',
      'estado_1': 'estado',
      'fechaRegistro_1': 'fechaRegistro',
    };
    
    console.log('\n🔄 Renombrando campos...\n');
    
    for (const doc of documentos) {
      const updates = {};
      const unsets = {};
      
      // Procesar campos de primer nivel
      for (const [oldName, newName] of Object.entries(renombramientos)) {
        if (!oldName.includes('.') && doc.hasOwnProperty(oldName)) {
          updates[newName] = doc[oldName];
          unsets[oldName] = "";
          console.log(`  ✓ ${oldName} → ${newName}`);
        }
      }
      
      // Procesar campos anidados (proyecto.*)
      if (doc.proyecto) {
        const proyectoUpdates = {};
        let hasProyectoChanges = false;
        
        for (const key in doc.proyecto) {
          if (key.endsWith('_1')) {
            const newKey = key.replace('_1', '');
            proyectoUpdates[newKey] = doc.proyecto[key];
            unsets[`proyecto.${key}`] = "";
            console.log(`  ✓ proyecto.${key} → proyecto.${newKey}`);
            hasProyectoChanges = true;
          }
        }
        
        if (hasProyectoChanges) {
          // Copiar campos existentes que no terminan en _1
          for (const key in doc.proyecto) {
            if (!key.endsWith('_1') && !proyectoUpdates.hasOwnProperty(key)) {
              proyectoUpdates[key] = doc.proyecto[key];
            }
          }
          updates.proyecto = proyectoUpdates;
        }
      }
      
      // Aplicar cambios si hay alguno
      if (Object.keys(updates).length > 0 || Object.keys(unsets).length > 0) {
        const updateDoc = {};
        if (Object.keys(updates).length > 0) {
          updateDoc.$set = updates;
        }
        if (Object.keys(unsets).length > 0) {
          updateDoc.$unset = unsets;
        }
        
        await collection.updateOne(
          { _id: doc._id },
          updateDoc
        );
        console.log(`✅ Documento ${doc._id} actualizado\n`);
      }
    }
    
    console.log('✅ Limpieza completada exitosamente!');
    
    // Verificar resultado
    console.log('\n📊 Verificando resultado...');
    const docActualizado = await collection.findOne({});
    if (docActualizado) {
      console.log('\nCampos después de la limpieza:');
      console.log(Object.keys(docActualizado));
    }
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

// Ejecutar limpieza
cleanFieldNames()
  .then(() => {
    console.log('\n🎉 Proceso completado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
