import { Router } from 'express';
import {
  createCart,
  getCart,
  addProductToCart,
  deleteProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  clearCart
} from '../controllers/cartController.js';

const router = Router();

// Crear carrito
router.post('/', createCart);

// Obtener carrito por ID
router.get('/:cid', getCart);

// Agregar producto al carrito
router.post('/:cid/products/:pid', addProductToCart);

// Eliminar producto específico
router.delete('/:cid/products/:pid', deleteProductFromCart);

// Reemplazar todos los productos del carrito
router.put('/:cid', updateCartProducts);

// Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', updateProductQuantity);

// Vaciar carrito
router.delete('/:cid', clearCart);

export default router;
