import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
  try {
    // MongoDB Atlas URI - Debe estar configurado en el archivo .env
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    
    // Configuración de conexión a MongoDB Atlas
    const mongooseOptions = {
      retryWrites: true,
      w: 'majority'
    };
    
    await mongoose.connect(uri, mongooseOptions);
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  }
};
