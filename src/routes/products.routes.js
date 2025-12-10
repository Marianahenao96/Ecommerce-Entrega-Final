import { Router } from 'express';
import passport from 'passport';
import * as ctrl from '../controllers/productController.js';
import { isAdmin } from '../middlewares/authorization.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

// API Routes - Productos con paginación (públicas)
router.get('/api', ctrl.getProducts);
router.get('/api/:pid', ctrl.getProductById);

// Vista Routes - Productos (públicas)
router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);

// Mostrar formulario para agregar producto (requiere admin)
// Para la vista, permitimos acceso pero el formulario validará con token
router.get('/view/add', (req, res) => {
  res.render('addProduct', { title: 'Agregar nuevo producto' });
});

// CRUD Operations - Solo admin puede crear, actualizar y eliminar
router.post('/', 
  authenticateJWT,
  isAdmin,
  ctrl.createProduct
);
router.put('/:pid', 
  authenticateJWT,
  isAdmin,
  ctrl.updateProduct
);
router.delete('/api/:pid', 
  authenticateJWT,
  isAdmin,
  ctrl.deleteProduct
);
router.delete('/:pid', 
  authenticateJWT,
  isAdmin,
  ctrl.deleteProduct
);
router.post('/:pid/decrease', 
  authenticateJWT,
  isAdmin,
  ctrl.decreaseStock
);

export default router;
