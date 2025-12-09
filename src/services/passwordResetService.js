import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userRepository from '../repositories/userRepository.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secret_key_super_segura_cambiar_en_produccion';
const RESET_TOKEN_EXPIRY = '1h'; // 1 hora

class PasswordResetService {
  // Generar token de recuperación de contraseña
  generateResetToken(userId) {
    return jwt.sign(
      { userId, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: RESET_TOKEN_EXPIRY }
    );
  }

  // Verificar token de recuperación de contraseña
  async verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        throw new Error('Token inválido');
      }
      
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.');
      }
      throw new Error('Token inválido o expirado');
    }
  }

  // Validar que la nueva contraseña no sea la misma que la anterior
  async validateNewPassword(userId, newPassword) {
    const user = await userRepository.getUserByIdWithPassword(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isSamePassword = await userRepository.comparePassword(user, newPassword);
    if (isSamePassword) {
      throw new Error('La nueva contraseña no puede ser la misma que la contraseña actual');
    }

    return true;
  }

  // Restablecer contraseña
  async resetPassword(token, newPassword) {
    // Verificar token
    const decoded = await this.verifyResetToken(token);
    
    // Validar que no sea la misma contraseña
    await this.validateNewPassword(decoded.userId, newPassword);
    
    // Actualizar contraseña
    await userRepository.updatePassword(decoded.userId, newPassword);
    
    return true;
  }
}

export default new PasswordResetService();

