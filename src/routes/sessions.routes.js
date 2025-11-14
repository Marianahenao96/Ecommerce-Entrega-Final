import express from 'express';
import passport from 'passport';
import { login } from '../controllers/userController.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta para obtener el usuario actual (requiere autenticación)
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    try {
      // El usuario está disponible en req.user gracias a la estrategia 'current'
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado'
        });
      }

      res.json({
        status: 'success',
        user: req.user
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

