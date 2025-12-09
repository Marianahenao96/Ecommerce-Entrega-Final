import userRepository from '../repositories/userRepository.js';
import passwordResetService from '../services/passwordResetService.js';
import emailService from '../services/emailService.js';

// Solicitar recuperación de contraseña
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'El email es requerido'
      });
    }

    // Buscar usuario
    const user = await userRepository.getUserByEmail(email);
    
    // Por seguridad, no revelamos si el email existe o no
    if (!user) {
      // Aun así, respondemos con éxito para no revelar información
      return res.json({
        status: 'success',
        message: 'Si el email existe, recibirás un correo con las instrucciones para restablecer tu contraseña'
      });
    }

    // Generar token de recuperación
    const resetToken = passwordResetService.generateResetToken(user._id);

    // Enviar email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Error al enviar el email de recuperación'
      });
    }

    res.json({
      status: 'success',
      message: 'Si el email existe, recibirás un correo con las instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar la solicitud de recuperación de contraseña',
      error: error.message
    });
  }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Restablecer contraseña
    await passwordResetService.resetPassword(token, newPassword);

    res.json({
      status: 'success',
      message: 'Contraseña restablecida exitosamente'
    });
  } catch (error) {
    let statusCode = 500;
    let message = 'Error al restablecer la contraseña';

    if (error.message.includes('expirado') || error.message.includes('inválido')) {
      statusCode = 400;
      message = error.message;
    } else if (error.message.includes('misma que la contraseña actual')) {
      statusCode = 400;
      message = error.message;
    }

    res.status(statusCode).json({
      status: 'error',
      message,
      error: error.message
    });
  }
};

