import { MongoClient } from 'mongodb';

/**
 * Script para insertar registros adicionales de unicornios
 * Ejecutar con: node src/scripts/insertUnicorniosAdicionales.js
 */

const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Unicornio';
const COLLECTION_NAME = 'unicornios';

// Nuevos registros de unicornios
const nuevosUnicornios = [
  {
    nombre: "Rappi",
    fundador: "Simón Borrero",
    añoFundacion: 2015,
    valoracion: 5250000000,
    sector: "Delivery & E-commerce",
    subsector: "Super App",
    pais: "Colombia",
    ciudad: "Bogotá",
    descripcion: "Super app de delivery, pagos y servicios on-demand",
    empleados: 12000,
    rondaFinanciamiento: "Serie F",
    inversionTotal: 2400000000,
    inversoresPrincipales: ["SoftBank", "DST Global", "Sequoia Capital"],
    etapa: "decacornio",
    ingresoAnual: 850000000,
    crecimientoAnual: 45,
    impactoSocial: "Generación de ingresos para más de 250,000 repartidores",
    odsRelacionados: [8, 11],
    tecnologias: ["React Native", "Node.js", "Kubernetes", "GCP"],
    clientesPrincipales: ["Usuarios B2C", "Retailers", "Restaurantes"],
    premios: ["Best Delivery App Latin America 2023"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Nubank",
    fundador: "David Vélez",
    añoFundacion: 2013,
    valoracion: 30000000000,
    sector: "FinTech",
    subsector: "Neobank",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Banco digital líder en Latinoamérica",
    empleados: 7000,
    rondaFinanciamiento: "Post-IPO",
    inversionTotal: 2100000000,
    inversoresPrincipales: ["Sequoia Capital", "Tiger Global", "Tencent"],
    etapa: "hectocornio",
    ingresoAnual: 2800000000,
    crecimientoAnual: 65,
    impactoSocial: "Inclusión financiera de 85 millones de clientes",
    odsRelacionados: [1, 8, 10],
    tecnologias: ["Clojure", "Kotlin", "AWS", "Kubernetes"],
    clientesPrincipales: ["Usuarios retail", "PYMEs"],
    premios: ["World's Best Bank 2024", "Most Innovative Company"],
    estado: "activo",
    cotizaBolsa: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Kavak",
    fundador: "Carlos García Ottati",
    añoFundacion: 2016,
    valoracion: 8700000000,
    sector: "E-commerce",
    subsector: "Autos Usados",
    pais: "México",
    ciudad: "Ciudad de México",
    descripcion: "Plataforma digital de compra-venta de autos usados",
    empleados: 8000,
    rondaFinanciamiento: "Serie E",
    inversionTotal: 1500000000,
    inversoresPrincipales: ["SoftBank", "General Catalyst", "DST Global"],
    etapa: "decacornio",
    ingresoAnual: 1200000000,
    crecimientoAnual: 85,
    impactoSocial: "Democratización del acceso a vehículos",
    odsRelacionados: [8, 9],
    tecnologias: ["React", "Python", "PostgreSQL", "AWS"],
    clientesPrincipales: ["Compradores individuales", "Dealers"],
    premios: ["Best Used Car Platform 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Mercado Libre",
    fundador: "Marcos Galperin",
    añoFundacion: 1999,
    valoracion: 65000000000,
    sector: "E-commerce",
    subsector: "Marketplace",
    pais: "Argentina",
    ciudad: "Buenos Aires",
    descripcion: "Marketplace y ecosistema de e-commerce más grande de Latinoamérica",
    empleados: 45000,
    rondaFinanciamiento: "Public",
    inversionTotal: 1800000000,
    inversoresPrincipales: ["Public Market", "eBay (histórico)"],
    etapa: "hectocornio",
    ingresoAnual: 14000000000,
    crecimientoAnual: 35,
    impactoSocial: "Digitalización del comercio latinoamericano",
    odsRelacionados: [8, 9, 11],
    tecnologias: ["Java", "React", "Kubernetes", "AWS"],
    clientesPrincipales: ["Vendedores PYME", "Grandes marcas", "Consumidores"],
    premios: ["Best E-commerce Platform Latin America 2024"],
    estado: "activo",
    cotizaBolsa: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Clip",
    fundador: "Adolfo Babatz",
    añoFundacion: 2012,
    valoracion: 2000000000,
    sector: "FinTech",
    subsector: "Payments",
    pais: "México",
    ciudad: "Ciudad de México",
    descripcion: "Terminal de pagos y servicios financieros para PYMEs",
    empleados: 3500,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 650000000,
    inversoresPrincipales: ["SoftBank", "Viking Global", "General Atlantic"],
    etapa: "unicornio",
    ingresoAnual: 450000000,
    crecimientoAnual: 70,
    impactoSocial: "Digitalización de pagos para 1.5 millones de negocios",
    odsRelacionados: [8, 9],
    tecnologias: ["iOS", "Android", "Java", "AWS"],
    clientesPrincipales: ["PYMEs", "Comercios locales"],
    premios: ["Best Payment Solution Mexico 2023"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Bitso",
    fundador: "Pablo González",
    añoFundacion: 2014,
    valoracion: 2200000000,
    sector: "FinTech",
    subsector: "Crypto Exchange",
    pais: "México",
    ciudad: "Ciudad de México",
    descripcion: "Exchange de criptomonedas líder en Latinoamérica",
    empleados: 850,
    rondaFinanciamiento: "Serie C",
    inversionTotal: 450000000,
    inversoresPrincipales: ["Paradigm", "Coatue", "Pantera Capital"],
    etapa: "unicornio",
    ingresoAnual: 180000000,
    crecimientoAnual: 120,
    impactoSocial: "Acceso a criptomonedas para 6 millones de usuarios",
    odsRelacionados: [8, 9],
    tecnologias: ["Node.js", "React", "PostgreSQL", "Kubernetes"],
    clientesPrincipales: ["Usuarios retail", "Instituciones"],
    premios: ["Best Crypto Exchange Latin America 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Cornershop",
    fundador: "Oskar Hjertonsson",
    añoFundacion: 2015,
    valoracion: 3000000000,
    sector: "E-commerce",
    subsector: "Grocery Delivery",
    pais: "Chile",
    ciudad: "Santiago",
    descripcion: "Plataforma de delivery de supermercado",
    empleados: 15000,
    rondaFinanciamiento: "Acquired",
    inversionTotal: 450000000,
    inversoresPrincipales: ["Uber (adquiriente)", "Accel", "Jackson Square Ventures"],
    etapa: "decacornio",
    ingresoAnual: 850000000,
    crecimientoAnual: 95,
    impactoSocial: "Acceso a alimentos para comunidades remotas",
    odsRelacionados: [2, 11],
    tecnologias: ["Ruby on Rails", "React Native", "AWS"],
    clientesPrincipales: ["Hogares", "Supermercados"],
    premios: ["Best Grocery Delivery App 2023"],
    estado: "adquirido",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "VTEX",
    fundador: "Geraldo Thomaz",
    añoFundacion: 2000,
    valoracion: 3200000000,
    sector: "E-commerce",
    subsector: "E-commerce Platform",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Plataforma de comercio digital para empresas",
    empleados: 3800,
    rondaFinanciamiento: "Post-IPO",
    inversionTotal: 700000000,
    inversoresPrincipales: ["Public Market", "Riverwood Capital"],
    etapa: "decacornio",
    ingresoAnual: 580000000,
    crecimientoAnual: 42,
    impactoSocial: "Digitalización de 3,400 marcas globales",
    odsRelacionados: [8, 9],
    tecnologias: [".NET", "React", "Node.js", "Azure"],
    clientesPrincipales: ["Walmart", "Sony", "Coca-Cola"],
    premios: ["Best Commerce Platform 2024"],
    estado: "activo",
    cotizaBolsa: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "dLocal",
    fundador: "Sebastián Kanovich",
    añoFundacion: 2016,
    valoracion: 5000000000,
    sector: "FinTech",
    subsector: "Payment Processing",
    pais: "Uruguay",
    ciudad: "Montevideo",
    descripcion: "Procesador de pagos para mercados emergentes",
    empleados: 900,
    rondaFinanciamiento: "Post-IPO",
    inversionTotal: 650000000,
    inversoresPrincipales: ["Public Market", "General Atlantic"],
    etapa: "decacornio",
    ingresoAnual: 420000000,
    crecimientoAnual: 75,
    impactoSocial: "Facilitación de pagos globales en 35 países",
    odsRelacionados: [8, 17],
    tecnologias: ["Java", "Python", "Kubernetes", "AWS"],
    clientesPrincipales: ["Microsoft", "Uber", "Nike"],
    premios: ["Best Payment Processor 2024"],
    estado: "activo",
    cotizaBolsa: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "QuintoAndar",
    fundador: "Gabriel Braga",
    añoFundacion: 2012,
    valoracion: 5100000000,
    sector: "PropTech",
    subsector: "Real Estate",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Plataforma digital de alquiler y venta de propiedades",
    empleados: 4500,
    rondaFinanciamiento: "Serie E",
    inversionTotal: 1200000000,
    inversoresPrincipales: ["SoftBank", "General Atlantic", "Ribbit Capital"],
    etapa: "decacornio",
    ingresoAnual: 680000000,
    crecimientoAnual: 65,
    impactoSocial: "Simplificación del acceso a vivienda para millones",
    odsRelacionados: [11],
    tecnologias: ["Python", "React", "PostgreSQL", "AWS"],
    clientesPrincipales: ["Propietarios", "Inquilinos"],
    premios: ["Best PropTech Company Brazil 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Wildlife Studios",
    fundador: "Victor Lazarte",
    añoFundacion: 2011,
    valoracion: 3000000000,
    sector: "Gaming",
    subsector: "Mobile Games",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Desarrolladora de juegos móviles",
    empleados: 2500,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 460000000,
    inversoresPrincipales: ["Benchmark", "Bessemer Venture Partners"],
    etapa: "decacornio",
    ingresoAnual: 520000000,
    crecimientoAnual: 38,
    impactoSocial: "Entretenimiento para 2 mil millones de usuarios",
    odsRelacionados: [9],
    tecnologias: ["Unity", "C++", "Python", "AWS"],
    clientesPrincipales: ["Jugadores mobile global"],
    premios: ["Best Mobile Game Studio 2023"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Creditas",
    fundador: "Sergio Furio",
    añoFundacion: 2012,
    valoracion: 4500000000,
    sector: "FinTech",
    subsector: "Lending",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Plataforma de préstamos con garantía",
    empleados: 3200,
    rondaFinanciamiento: "Serie F",
    inversionTotal: 1100000000,
    inversoresPrincipales: ["SoftBank", "Kaszek Ventures", "QED Investors"],
    etapa: "decacornio",
    ingresoAnual: 650000000,
    crecimientoAnual: 58,
    impactoSocial: "Acceso a crédito asequible para clase media",
    odsRelacionados: [1, 8],
    tecnologias: ["Java", "React", "AWS", "Kubernetes"],
    clientesPrincipales: ["Clase media brasileña"],
    premios: ["Best Lending Platform Brazil 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Uala",
    fundador: "Pierpaolo Barbieri",
    añoFundacion: 2017,
    valoracion: 2450000000,
    sector: "FinTech",
    subsector: "Digital Banking",
    pais: "Argentina",
    ciudad: "Buenos Aires",
    descripcion: "Cuenta digital y servicios financieros",
    empleados: 1800,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 544000000,
    inversoresPrincipales: ["SoftBank", "Tencent", "Goldman Sachs"],
    etapa: "unicornio",
    ingresoAnual: 320000000,
    crecimientoAnual: 92,
    impactoSocial: "Inclusión financiera de 5 millones de usuarios",
    odsRelacionados: [1, 8, 10],
    tecnologias: ["Kotlin", "Swift", "Node.js", "AWS"],
    clientesPrincipales: ["Usuarios sin acceso a banca tradicional"],
    premios: ["Best Digital Bank Argentina 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Konfio",
    fundador: "David Arana",
    añoFundacion: 2013,
    valoracion: 1300000000,
    sector: "FinTech",
    subsector: "SME Lending",
    pais: "México",
    ciudad: "Ciudad de México",
    descripcion: "Créditos y servicios financieros para PYMEs",
    empleados: 850,
    rondaFinanciamiento: "Serie E",
    inversionTotal: 434000000,
    inversoresPrincipales: ["SoftBank", "Kaszek Ventures", "Valar Ventures"],
    etapa: "unicornio",
    ingresoAnual: 180000000,
    crecimientoAnual: 78,
    impactoSocial: "Financiamiento a 100,000 PYMEs mexicanas",
    odsRelacionados: [8, 9],
    tecnologias: ["Python", "React", "PostgreSQL", "AWS"],
    clientesPrincipales: ["PYMEs mexicanas"],
    premios: ["Best SME Fintech Mexico 2023"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: "Loft",
    fundador: "Mate Pencz",
    añoFundacion: 2018,
    valoracion: 2900000000,
    sector: "PropTech",
    subsector: "Real Estate",
    pais: "Brasil",
    ciudad: "São Paulo",
    descripcion: "Plataforma de compra-venta de inmuebles",
    empleados: 1500,
    rondaFinanciamiento: "Serie D",
    inversionTotal: 900000000,
    inversoresPrincipales: ["D1 Capital Partners", "Andreessen Horowitz"],
    etapa: "unicornio",
    ingresoAnual: 420000000,
    crecimientoAnual: 85,
    impactoSocial: "Transparencia en mercado inmobiliario",
    odsRelacionados: [11],
    tecnologias: ["React", "Node.js", "PostgreSQL", "GCP"],
    clientesPrincipales: ["Compradores y vendedores de propiedades"],
    premios: ["Best PropTech Startup 2024"],
    estado: "activo",
    cotizaBolsa: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function insertarUnicornios() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log(`\n📝 Insertando ${nuevosUnicornios.length} nuevos unicornios...\n`);
    
    let insertados = 0;
    let duplicados = 0;
    
    for (const unicornio of nuevosUnicornios) {
      try {
        await collection.insertOne(unicornio);
        console.log(`✅ ${unicornio.nombre} - ${unicornio.pais} ($${(unicornio.valoracion / 1000000000).toFixed(1)}B)`);
        insertados++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  ${unicornio.nombre} - Ya existe (duplicado)`);
          duplicados++;
        } else {
          console.error(`❌ Error al insertar ${unicornio.nombre}:`, error.message);
        }
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Insertados: ${insertados}`);
    console.log(`   ⚠️  Duplicados: ${duplicados}`);
    console.log(`   📦 Total intentados: ${nuevosUnicornios.length}`);
    
    // Mostrar total de unicornios
    const total = await collection.countDocuments();
    console.log(`\n🦄 Total de unicornios en la base de datos: ${total}`);
    
    // Mostrar estadísticas por país
    console.log('\n🌍 Unicornios por país:');
    const porPais = await collection.aggregate([
      { $group: { _id: '$pais', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } }
    ]).toArray();
    
    porPais.forEach(item => {
      console.log(`   ${item._id}: ${item.cantidad}`);
    });
    
    // Mostrar estadísticas por sector
    console.log('\n💼 Unicornios por sector:');
    const porSector = await collection.aggregate([
      { $group: { _id: '$sector', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } }
    ]).toArray();
    
    porSector.forEach(item => {
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
insertarUnicornios()
  .then(() => {
    console.log('\n🎉 ¡Todos los unicornios insertados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
