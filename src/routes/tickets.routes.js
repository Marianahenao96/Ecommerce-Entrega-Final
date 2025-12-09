import express from 'express';
import passport from 'passport';
import {
  processPurchase,
  getUserTickets,
  getTicketById
} from '../controllers/ticketController.js';
import { isUser, isAdmin } from '../middlewares/authorization.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(passport.authenticate('current', { session: false }));

// Procesar compra del carrito (solo usuarios)
router.post('/carts/:cid/purchase', isUser, processPurchase);

// Obtener tickets del usuario actual
router.get('/mytickets', getUserTickets);

// Obtener ticket por ID (usuario puede ver solo sus tickets, admin puede ver todos)
router.get('/:tid', getTicketById);

export default router;

