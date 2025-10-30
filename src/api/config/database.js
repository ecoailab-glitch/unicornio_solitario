import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Unicornio';
let client = null;
let db = null;

export const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    
    // Extract database name from URI
    const dbName = uri.split('/').pop().split('?')[0];
    db = client.db(dbName);
    
    console.log(`✅ Conectado a la base de datos: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama primero a connectToDatabase()');
  }
  return db;
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};

export default { connectToDatabase, getDatabase, closeConnection };
