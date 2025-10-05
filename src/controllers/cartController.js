// src/controllers/cartController.js
import CartModel from '../models/Cart.js';
import ProductModel from '../models/Product.js'; // ajusta si tu archivo se llama product.js

// Crear carrito vacío
export const createCart = async (req, res) => {
  try {
    const cart = await CartModel.create({ products: [] });
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error creando carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error creando carrito' });
  }
};

// Obtener carrito por id (populate)
export const getCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartModel.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    // Si se solicita desde la vista, renderizamos
    if (req.originalUrl.startsWith('/api/')) {
      res.json({ status: 'success', payload: cart });
    } else {
      res.render('cart', { cart });
    }
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error obteniendo carrito' });
  }
};

// Agregar producto al carrito (POST /api/carts/:cid/products/:pid)
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    // validar que el producto exista
    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    console.error('Error agregando producto al carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error agregando producto al carrito' });
  }
};

// Eliminar producto del carrito (DELETE /api/carts/:cid/products/:pid)
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Producto eliminado', payload: cart });
  } catch (error) {
    console.error('Error eliminando producto del carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error eliminando producto del carrito' });
  }
};

// Reemplazar todos los productos del carrito (PUT /api/carts/:cid)
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products; // esperar: [{ product: 'pid', quantity: 2 }, ...]
    if (!Array.isArray(newProducts)) return res.status(400).json({ status: 'error', message: 'products debe ser un arreglo' });

    // opcional: validar que cada product id exista en ProductModel
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = newProducts.map(p => ({ product: p.product, quantity: p.quantity || 1 }));
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    console.error('Error actualizando productos del carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error actualizando productos del carrito' });
  }
};

// Actualizar cantidad de un producto específico (PUT /api/carts/:cid/products/:pid)
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity == null) return res.status(400).json({ status: 'error', message: 'quantity es requerido' });

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Producto no existe en el carrito' });

    item.quantity = parseInt(quantity);
    await cart.save();
    const populated = await cart.populate('products.product');
    res.json({ status: 'success', payload: populated });
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    res.status(500).json({ status: 'error', message: 'Error actualizando cantidad' });
  }
};

// Eliminar todos los productos del carrito (DELETE /api/carts/:cid)
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error vaciando carrito' });
  }
};
