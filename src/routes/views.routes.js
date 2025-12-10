import { Router } from 'express';
import ProductModel from '../models/Product.js';
import CartModel from '../models/Cart.js';

const router = Router();

//  Redirección principal
router.get('/', (req, res) => res.redirect('/products'));

//  Listar productos (con paginación, filtros y orden)
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Buscar o crear un carrito genérico para usuarios no logueados
    // Los usuarios logueados usarán su propio carrito
    let cart = await CartModel.findOne().sort({ createdAt: -1 });
    if (!cart) {
      cart = await CartModel.create({ products: [] });
      console.log('🛒 Nuevo carrito creado con ID:', cart._id);
    }

    // Construir filtros basados en query
    let filter = {};
    if (query) {
      if (query === 'available') {
        filter = { stock: { $gt: 0 }, status: true };
      } else {
        // Validar que la categoría sea válida
        const validCategories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'automotive', 'other'];
        if (validCategories.includes(query)) {
          filter = { category: query, status: true };
        } else {
          // Si la categoría no es válida, mostrar todos los productos activos
          filter = { status: true };
        }
      }
    } else {
      // Por defecto, mostrar solo productos activos
      filter = { status: true };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };

    if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };

    const result = await ProductModel.paginate(filter, options);

    res.render('products', {
      title: 'Productos',
      products: result.docs, // Para compatibilidad con la vista
      payload: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage 
        ? `?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` 
        : null,
      nextLink: result.hasNextPage 
        ? `?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` 
        : null,
      cartId: cart._id.toString(),
      limit,
      sort,
      query,
    });
  } catch (error) {
    console.error(' Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//  Detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) return res.status(404).send('Producto no encontrado');

    //  Buscar o crear un carrito (si no existe)
    let cart = await CartModel.findOne();
    if (!cart) {
      cart = await CartModel.create({ products: [] });
      console.log('🛒 Nuevo carrito creado con ID:', cart._id);
    }

    res.render('productDetail', {
      title: product.title,
      product,
      cartId: cart._id.toString(),
    });
  } catch (error) {
    console.error(' Error al obtener el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista del carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', {
      title: 'Carrito',
      cart,
    });
  } catch (error) {
    console.error(' Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//  Formulario para agregar productos (solo vista)
router.get('/add-product', (req, res) => {
  res.render('addProduct', { title: 'Agregar Producto' });
});

//  Vistas de autenticación
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Mi Perfil' });
});

export default router;
