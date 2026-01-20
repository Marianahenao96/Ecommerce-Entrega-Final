import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Atlas URI - Debe estar configurado en el archivo .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Configuración de conexión a MongoDB Atlas
const mongooseOptions = {
  retryWrites: true,
  w: 'majority'
};

/**
 * Conecta a la base de datos MongoDB
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Verificar si ya hay una conexión activa
    if (mongoose.connection.readyState === 1) {
      console.log('Ya hay una conexión activa a MongoDB');
      return;
    }

    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('✅ Conectado a MongoDB');
    
    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error en la conexión de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

    // Manejar cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada por terminación de la aplicación');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    throw err; // Lanzar el error para que el llamador lo maneje
  }
};

/**
 * Desconecta de la base de datos MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Desconectado de MongoDB');
    }
  } catch (err) {
    console.error('Error desconectando de MongoDB:', err);
  }
};
