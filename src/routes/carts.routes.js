// src/routes/carts.routes.js
import { Router } from 'express';
import passport from 'passport';
import {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantity,
  updateCart,
  clearCart
} from '../controllers/cartController.js';
import { isUser } from '../middlewares/authorization.js';

const router = Router();

// ✅ Crear carrito
router.post('/', createCart);

// ✅ Obtener carrito (con populate)
router.get('/:cid', getCart);

// ✅ Agregar producto al carrito (solo usuarios, no admin)
router.post('/:cid/products/:pid', 
  (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Error en la autenticación',
          error: err.message
        });
      }
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado - Token inválido o expirado. Por favor, inicia sesión nuevamente.'
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  isUser,
  addProductToCart
);

// ✅ Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', deleteProductFromCart);

// ✅ Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', updateProductQuantity);

// ✅ Actualizar todos los productos del carrito
router.put('/:cid', updateCart);

// ✅ Vaciar carrito (eliminar todos los productos)
router.delete('/:cid', clearCart);

export default router;
