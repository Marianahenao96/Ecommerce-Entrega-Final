import { Router } from 'express';
import { ProductModel } from '../models/Product.js';
import { CartModel } from '../models/Cart.js';
const router = Router();
router.get('/', (req, res) => res.redirect('/products'));
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const filter = query ? (query === 'available' ? { stock: { $gt: 0 } } : { category: query }) : {};
  const options = { page: parseInt(page), limit: parseInt(limit), lean: true };
  if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };
  const result = await ProductModel.paginate(filter, options);
  res.render('products', {
    title: 'Productos',
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
  });
});
router.get('/products/:pid', async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();
  res.render('productDetail', { title: product.title, product });
});
router.get('/carts/:cid', async (req, res) => {
  const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
  res.render('cart', { title: 'Carrito', cart });
});
export default router;
