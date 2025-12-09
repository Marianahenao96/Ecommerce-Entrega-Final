import express from 'express';
import {
  requestPasswordReset,
  resetPassword
} from '../controllers/passwordResetController.js';

const router = express.Router();

// Solicitar recuperación de contraseña
router.post('/request', requestPasswordReset);

// Restablecer contraseña con token
router.post('/reset', resetPassword);

export default router;

