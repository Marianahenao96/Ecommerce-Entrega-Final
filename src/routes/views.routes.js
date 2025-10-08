import { Router } from 'express';
import ProductModel from '../models/Product.js';
import CartModel from '../models/Cart.js';

const router = Router();

// 🔹 Redirección principal
router.get('/', (req, res) => res.redirect('/products'));

// 📦 Listar productos (con paginación, filtros y orden)
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // ✅ Buscar o crear un carrito (si no existe, se genera uno nuevo)
    let cart = await CartModel.findOne();
    if (!cart) {
      cart = await CartModel.create({ products: [] });
      console.log('🛒 Nuevo carrito creado con ID:', cart._id);
    }

    // 🔹 Filtros dinámicos
    const filter = query
      ? query === 'available'
        ? { stock: { $gt: 0 } }
        : { category: query }
      : {};

    // 🔹 Opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    // 🔹 Ordenamiento opcional
    if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };

    // 🔹 Consulta con paginate
    const result = await ProductModel.paginate(filter, options);

    // 🔹 Renderizar vista con productos y pasar cartId
    res.render('products', {
      title: 'Productos',
      payload: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      cartId: cart._id.toString() // 👈 Se pasa el ID real del carrito
    });

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// 🧾 Detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('productDetail', {
      title: product.title,
      product
    });
  } catch (error) {
    console.error('❌ Error al obtener el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// 🛒 Vista del carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate('products.product')
      .lean();

    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', {
      title: 'Carrito',
      cart
    });
  } catch (error) {
    console.error('❌ Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
