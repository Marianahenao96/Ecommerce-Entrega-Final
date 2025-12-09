import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import emailService from './services/emailService.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
// MongoDB Atlas URI - Debe estar configurado en el archivo .env
// Formato: mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Configuración de conexión a MongoDB Atlas
const mongooseOptions = {
  // Opciones recomendadas para MongoDB Atlas
  retryWrites: true,
  w: 'majority'
};

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    // Verificar conexión con servidor de email (si está configurado)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await emailService.verifyConnection();
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
