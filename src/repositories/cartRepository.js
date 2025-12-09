import cartDAO from '../dao/cartDAO.js';
import productDAO from '../dao/productDAO.js';

class CartRepository {
  async createCart() {
    return await cartDAO.create({ products: [] });
  }

  async getCartById(id) {
    return await cartDAO.findByIdPopulated(id);
  }

  async getCartByIdForUpdate(id) {
    return await cartDAO.findById(id);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const product = await productDAO.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const existingProduct = cart.products.find(
      p => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += Number(quantity);
    } else {
      cart.products.push({ product: productId, quantity: Number(quantity) });
    }

    await cartDAO.save(cart);
    return await cartDAO.findByIdPopulated(cartId);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== productId
    );

    await cartDAO.save(cart);
    return await cartDAO.findByIdPopulated(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productInCart = cart.products.find(
      p => p.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity = Number(quantity);
    }

    await cartDAO.save(cart);
    return await cartDAO.findByIdPopulated(cartId);
  }

  async updateCart(cartId, products) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = products;
    await cartDAO.save(cart);
    return await cartDAO.findByIdPopulated(cartId);
  }

  async clearCart(cartId) {
    const cart = await cartDAO.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.products = [];
    await cartDAO.save(cart);
    return cart;
  }

  async deleteCart(cartId) {
    return await cartDAO.deleteById(cartId);
  }
}

export default new CartRepository();

