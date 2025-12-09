import { Router } from 'express';
import passport from 'passport';
import * as ctrl from '../controllers/productController.js';
import { isAdmin } from '../middlewares/authorization.js';

const router = Router();

// ✅ API Routes - Productos con paginación (públicas)
router.get('/api', ctrl.getProducts);
router.get('/api/:pid', ctrl.getProductById);

// ✅ Vista Routes - Productos (públicas)
router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);

// ✅ Mostrar formulario para agregar producto (requiere admin)
router.get('/view/add', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  (req, res) => {
    res.render('addProduct', { title: 'Agregar nuevo producto' });
  }
);

// ✅ CRUD Operations - Solo admin puede crear, actualizar y eliminar
router.post('/', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  ctrl.createProduct
);
router.put('/:pid', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  ctrl.updateProduct
);
router.delete('/api/:pid', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  ctrl.deleteProduct
);
router.delete('/:pid', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  ctrl.deleteProduct
);
router.post('/:pid/decrease', 
  passport.authenticate('current', { session: false }),
  isAdmin,
  ctrl.decreaseStock
);

export default router;
