// src/routes/carts.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/cartController.js';

const router = Router();

router.post('/', ctrl.createCart);
router.get('/:cid', ctrl.getCart); // API y vista (populate)
router.post('/:cid/products/:pid', ctrl.addProductToCart);
router.delete('/:cid/products/:pid', ctrl.deleteProductFromCart);
router.put('/:cid', ctrl.updateCartProducts);
router.put('/:cid/products/:pid', ctrl.updateProductQuantity);
router.delete('/:cid', ctrl.clearCart);

export default router;
