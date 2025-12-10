import express from 'express';
import { login, logout } from '../controllers/userController.js';
import UserDTO from '../dto/userDTO.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta de logout (requiere autenticación)
router.post(
  '/logout',
  authenticateJWT,
  logout
);

// Ruta para obtener el usuario actual (requiere autenticación)
// Modificada para usar DTO y no enviar información sensible
router.get(
  '/current',
  authenticateJWT,
  (req, res) => {
    try {
      // El usuario está disponible en req.user gracias al middleware authenticateJWT
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado'
        });
      }

      // Crear DTO para enviar solo información no sensible
      const userDTO = UserDTO.from(req.user);

      res.json({
        status: 'success',
        user: userDTO.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener usuario actual',
        error: error.message
      });
    }
  }
);

export default router;

