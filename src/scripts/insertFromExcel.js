import { MongoClient } from 'mongodb';
import XLSX from 'xlsx';
import { join } from 'path';

/**
 * Script para leer archivos Excel de unicornios e insertarlos en MongoDB
 * Ejecutar con: node src/scripts/insertFromExcel.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'unicornios';

// Rutas a los archivos Excel
const EXCEL_FILES = [
  'C:\\Users\\TheYa\\Documents\\Git\\unicornio_solitario\\unicorns_with_additional_info.xlsx',
  'C:\\Users\\TheYa\\Documents\\Git\\unicornio_solitario\\CB-Insights_Global-Unicorn-Club_2025(Unicorns) (1).xlsx'
];

/**
 * Mapea los datos del Excel al formato de la BD
 */
function mapearDatosExcel(row, sourceFile) {
  // Función auxiliar para limpiar valores
  const cleanValue = (val) => {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'string') return val.trim();
    return val;
  };

  // Función para parsear valoración (puede venir como "$1B", "1000000000", etc)
  const parseValoracion = (val) => {
    if (!val) return 1000000000; // Default 1B
    
    let valorStr = String(val).toUpperCase().replace(/[^0-9.BM]/g, '');
    let valor = parseFloat(valorStr);
    
    if (valorStr.includes('B')) {
      valor = valor * 1000000000;
    } else if (valorStr.includes('M')) {
      valor = valor * 1000000;
    }
    
    return valor >= 1000000000 ? valor : 1000000000;
  };

  // Función para determinar etapa según valoración
  const determinarEtapa = (valoracion) => {
    if (valoracion >= 100000000000) return 'hectocornio'; // $100B+
    if (valoracion >= 10000000000) return 'decacornio';   // $10B+
    return 'unicornio'; // $1B+
  };

  // Mapeo de nombres de columnas comunes en Excel a nuestro formato
  const nombre = cleanValue(row['Company'] || row['Nombre'] || row['Name'] || row['company'] || row['nombre']);
  const valoracion = parseValoracion(row['Valuation'] || row['Valoracion'] || row['Value'] || row['valuation'] || row['valoracion']);
  const pais = cleanValue(row['Country'] || row['Pais'] || row['País'] || row['country'] || row['pais']);
  const ciudad = cleanValue(row['City'] || row['Ciudad'] || row['city'] || row['ciudad']);
  const sector = cleanValue(row['Industry'] || row['Sector'] || row['sector'] || row['industry']);
  const fundador = cleanValue(row['Founder'] || row['Fundador'] || row['founder'] || row['fundador'] || row['Founders']);
  const añoFundacion = cleanValue(row['Year Founded'] || row['Año Fundacion'] || row['Founded'] || row['year_founded'] || row['año_fundacion']);
  const inversores = cleanValue(row['Investors'] || row['Inversores'] || row['investors'] || row['inversores']);
  
  // Convertir año a número
  let añoFundacionNum = null;
  if (añoFundacion) {
    añoFundacionNum = parseInt(añoFundacion);
    if (isNaN(añoFundacionNum) || añoFundacionNum < 1900 || añoFundacionNum > 2030) {
      añoFundacionNum = 2020; // Default
    }
  }

  // Crear objeto mapeado
  const unicornio = {
    nombre: nombre || 'Unknown',
    fundador: fundador || 'Unknown',
    añoFundacion: añoFundacionNum || 2020,
    valoracion: valoracion,
    sector: sector || 'Technology',
    subsector: cleanValue(row['Subsector'] || row['subsector']) || '',
    pais: pais || 'Unknown',
    ciudad: ciudad || '',
    descripcion: cleanValue(row['Description'] || row['Descripcion'] || row['description']) || `${nombre} - ${sector}`,
    empleados: parseInt(cleanValue(row['Employees'] || row['Empleados'] || row['employees'])) || null,
    rondaFinanciamiento: cleanValue(row['Round'] || row['Ronda'] || row['round']) || '',
    inversionTotal: parseFloat(cleanValue(row['Total Funding'] || row['Investment'] || row['total_funding'])) || null,
    inversoresPrincipales: inversores ? inversores.split(',').map(i => i.trim()) : [],
    etapa: determinarEtapa(valoracion),
    ingresoAnual: null,
    crecimientoAnual: null,
    impactoSocial: cleanValue(row['Impact'] || row['Impacto']) || '',
    odsRelacionados: [],
    tecnologias: [],
    clientesPrincipales: [],
    premios: [],
    estado: 'activo',
    cotizaBolsa: cleanValue(row['Public'] || row['IPO']) === 'Yes' || cleanValue(row['Public'] || row['IPO']) === 'Sí',
    fuenteDatos: sourceFile,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return unicornio;
}

async function insertFromExcel() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('📊 Leyendo archivos Excel...\n');
    
    let todosLosUnicornios = [];
    
    // Leer cada archivo Excel
    for (const filePath of EXCEL_FILES) {
      try {
        console.log(`📂 Procesando: ${filePath.split('\\').pop()}`);
        
        // Leer el archivo Excel
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Primera hoja
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir a JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`   ✅ ${data.length} registros encontrados`);
        
        // Mapear cada fila al formato de BD
        const unicorniosMapeados = data.map(row => mapearDatosExcel(row, filePath.split('\\').pop()));
        todosLosUnicornios = todosLosUnicornios.concat(unicorniosMapeados);
        
      } catch (error) {
        console.error(`   ❌ Error al leer ${filePath}:`, error.message);
      }
    }
    
    console.log(`\n📦 Total de registros a insertar: ${todosLosUnicornios.length}\n`);
    
    if (todosLosUnicornios.length === 0) {
      console.log('⚠️  No hay datos para insertar');
      return;
    }
    
    // Conectar a MongoDB
    await client.connect();
    console.log('✅ Conectado a MongoDB\n');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`📝 Insertando ${todosLosUnicornios.length} unicornios...\n`);
    
    let insertados = 0;
    let duplicados = 0;
    let errores = 0;
    
    // Bucle para recorrer e insertar cada registro
    for (let i = 0; i < todosLosUnicornios.length; i++) {
      const unicornio = todosLosUnicornios[i];
      
      try {
        // Verificar si ya existe por nombre
        const existe = await collection.findOne({ nombre: unicornio.nombre });
        
        if (existe) {
          console.log(`⚠️  [${i + 1}/${todosLosUnicornios.length}] ${unicornio.nombre} - Ya existe`);
          duplicados++;
        } else {
          // Insertar el registro
          await collection.insertOne(unicornio);
          console.log(`✅ [${i + 1}/${todosLosUnicornios.length}] ${unicornio.nombre} - ${unicornio.pais} ($${(unicornio.valoracion / 1000000000).toFixed(1)}B)`);
          insertados++;
        }
        
      } catch (error) {
        console.error(`❌ [${i + 1}/${todosLosUnicornios.length}] Error al insertar ${unicornio.nombre}:`, error.message);
        errores++;
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Insertados exitosamente: ${insertados}`);
    console.log(`   ⚠️  Duplicados (ya existían): ${duplicados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📦 Total procesados: ${todosLosUnicornios.length}`);
    
    // Mostrar total de unicornios en la BD
    const total = await collection.countDocuments();
    console.log(`\n🦄 Total de unicornios en la base de datos: ${total}`);
    
    // Estadísticas
    console.log('\n📈 Estadísticas actualizadas:');
    
    // Por país
    const porPais = await collection.aggregate([
      { $group: { _id: '$pais', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    console.log('\n🌍 Top 10 países:');
    porPais.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item._id}: ${item.cantidad} unicornios`);
    });
    
    // Por sector
    const porSector = await collection.aggregate([
      { $group: { _id: '$sector', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    console.log('\n💼 Top 10 sectores:');
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
    
    // Por etapa
    const porEtapa = await collection.aggregate([
      { $group: { _id: '$etapa', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } }
    ]).toArray();
    
    console.log('\n🦄 Por etapa:');
    porEtapa.forEach((item) => {
      console.log(`   ${item._id}: ${item.cantidad}`);
    });
    
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
insertFromExcel()
  .then(() => {
    console.log('\n🎉 ¡Importación desde Excel completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
