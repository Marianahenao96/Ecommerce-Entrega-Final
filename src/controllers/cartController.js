// src/controllers/cartController.js
import CartModel from '../models/Cart.js';
import ProductModel from '../models/Product.js';

// ✅ Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ message: 'Carrito creado', cart: newCart });
  } catch (error) {
    console.error('❌ Error al crear carrito:', error);
    res.status(500).json({ message: 'Error al crear carrito' });
  }
};

// ✅ Obtener carrito por ID
export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('products.product').lean();
    
    if (!cart) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
      return res.status(404).send('Carrito no encontrado');
    }

    // Calcular totales del carrito
    let cartSubtotal = 0;
    let cartTotal = 0;
    
    if (cart.products && cart.products.length > 0) {
      cartSubtotal = cart.products.reduce((total, item) => {
        return total + (item.quantity * item.product.price);
      }, 0);
      cartTotal = cartSubtotal; // Por ahora no hay impuestos
    }

    if (req.path.startsWith('/api/')) {
      return res.json({ 
        status: 'success', 
        payload: cart,
        cartSubtotal,
        cartTotal
      });
    }

    res.render('cart', { 
      title: 'Mi carrito', 
      cart,
      cartSubtotal,
      cartTotal
    });
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ status: 'error', message: 'Error al obtener carrito' });
    }
    
    res.status(500).send('Error al obtener carrito');
  }
};

// ✅ Agregar producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    const existing = cart.products.find(p => p.product.toString() === pid);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.products.push({ product: pid, quantity: Number(quantity) });
    }

    await cart.save();
    console.log(`✅ Producto ${pid} agregado al carrito ${cid}`);
    res.redirect('/api/products');
  } catch (error) {
    console.error('❌ Error al agregar producto al carrito:', error);
    res.status(500).send('Error al agregar producto al carrito');
  }
};

// ✅ Eliminar producto específico del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    
    if (!cart) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
      return res.status(404).send('Carrito no encontrado');
    }

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    if (req.path.startsWith('/api/')) {
      return res.json({ 
        status: 'success', 
        message: 'Producto eliminado del carrito',
        cart: await CartModel.findById(cid).populate('products.product')
      });
    }
    
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('❌ Error al eliminar producto del carrito:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito' });
    }
    
    res.status(500).send('Error al eliminar producto del carrito');
  }
};

// ✅ Actualizar cantidad de un producto
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) productInCart.quantity = Number(quantity);

    await cart.save();
    res.redirect(`/api/carts/${cid}`);
  } catch (error) {
    console.error('❌ Error al actualizar cantidad:', error);
    res.status(500).send('Error al actualizar cantidad');
  }
};

// ✅ Actualizar todos los productos del carrito
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    const cart = await CartModel.findById(cid);
    if (!cart) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
      return res.status(404).send('Carrito no encontrado');
    }

    // Validar que products sea un array
    if (!Array.isArray(products)) {
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ status: 'error', message: 'Products debe ser un array' });
      }
      return res.status(400).send('Products debe ser un array');
    }

    // Actualizar todos los productos del carrito
    cart.products = products;
    await cart.save();

    if (req.path.startsWith('/api/')) {
      return res.json({ 
        status: 'success', 
        message: 'Carrito actualizado',
        cart: await CartModel.findById(cid).populate('products.product')
      });
    }
    
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('❌ Error al actualizar carrito:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ status: 'error', message: 'Error al actualizar carrito' });
    }
    
    res.status(500).send('Error al actualizar carrito');
  }
};

// ✅ Vaciar carrito (eliminar todos los productos)
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    
    if (!cart) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
      return res.status(404).send('Carrito no encontrado');
    }

    cart.products = [];
    await cart.save();

    if (req.path.startsWith('/api/')) {
      return res.json({ 
        status: 'success', 
        message: 'Carrito vaciado',
        cart
      });
    }
    
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ status: 'error', message: 'Error al vaciar carrito' });
    }
    
    res.status(500).send('Error al vaciar carrito');
  }
};
