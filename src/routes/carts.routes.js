// src/routes/carts.routes.js
import { Router } from 'express';
import {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantity,
  updateCart,
  clearCart
} from '../controllers/cartController.js';

const router = Router();

// ✅ Crear carrito
router.post('/', createCart);

// ✅ Obtener carrito (con populate)
router.get('/:cid', getCart);

// ✅ Agregar producto al carrito
router.post('/:cid/products/:pid', addProductToCart);

// ✅ Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', deleteProductFromCart);

// ✅ Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', updateProductQuantity);

// ✅ Actualizar todos los productos del carrito
router.put('/:cid', updateCart);

// ✅ Vaciar carrito (eliminar todos los productos)
router.delete('/:cid', clearCart);

export default router;
