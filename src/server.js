import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import emailService from './services/emailService.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

/**
 * Inicia el servidor de la aplicación
 */
async function startServer() {
  try {
    // Conectar a la base de datos usando la configuración centralizada
    await connectDB();
    
    // Verificar conexión con servidor de email (si está configurado)
    // Esto se hace después de la conexión a DB para no bloquear el inicio del servidor
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await emailService.verifyConnection();
      } catch (emailError) {
        console.warn('⚠️ Advertencia: No se pudo verificar la conexión del servidor de email:', emailError.message);
        console.warn('El servidor continuará funcionando, pero el servicio de email puede no estar disponible.');
      }
    }
    
    // Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // No salir inmediatamente, permitir que el servidor intente recuperarse
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Iniciar el servidor
startServer();
