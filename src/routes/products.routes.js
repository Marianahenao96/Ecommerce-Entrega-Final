import { Router } from 'express';
import * as ctrl from '../controllers/productController.js';

const router = Router();

// ✅ API Routes - Productos con paginación
router.get('/api', ctrl.getProducts);
router.get('/api/:pid', ctrl.getProductById);

// ✅ Vista Routes - Productos
router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);

// ✅ Mostrar formulario para agregar producto
router.get('/view/add', (req, res) => {
  res.render('addProduct', { title: 'Agregar nuevo producto' });
});

// ✅ CRUD Operations
router.post('/', ctrl.createProduct);
router.put('/:pid', ctrl.updateProduct);
router.delete('/:pid', ctrl.deleteProduct);
router.post('/:pid/decrease', ctrl.decreaseStock);

export default router;
