import { CartModel } from '../models/Cart.js';
import { ProductModel } from '../models/Product.js';
export const createCart = async (req, res) => {
  try {
    const cart = await CartModel.create({ products: [] });
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) item.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const replaceCart = async (req, res) => {
  try {
    const { products } = req.body;
    const updated = await CartModel.findByIdAndUpdate(req.params.cid, { products }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ error: 'Producto no en carrito' });
    item.quantity = Number(quantity);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const clearCart = async (req, res) => {
  try {
    const updated = await CartModel.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};