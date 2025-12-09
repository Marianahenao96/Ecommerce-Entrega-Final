import cartRepository from '../repositories/cartRepository.js';
import productRepository from '../repositories/productRepository.js';
import ticketRepository from '../repositories/ticketRepository.js';
import userRepository from '../repositories/userRepository.js';

class PurchaseService {
  async processPurchase(cartId, userEmail) {
    const cart = await cartRepository.getCartByIdForUpdate(cartId);
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    if (!cart.products || cart.products.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Obtener productos completos con populate
    const cartPopulated = await cartRepository.getCartById(cartId);
    if (!cartPopulated) {
      throw new Error('Carrito no encontrado');
    }

    const productsAvailable = [];
    const productsUnavailable = [];
    let totalAmount = 0;

    // Verificar stock de cada producto
    for (const item of cartPopulated.products) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      const stockCheck = await productRepository.checkStock(
        product._id,
        requestedQuantity
      );

      if (stockCheck.available) {
        // Disminuir stock
        await productRepository.decreaseStock(product._id, requestedQuantity);
        
        productsAvailable.push({
          product: product._id,
          quantity: requestedQuantity,
          price: product.price
        });

        totalAmount += product.price * requestedQuantity;
      } else {
        // Producto no disponible
        productsUnavailable.push({
          product: product._id,
          quantity: stockCheck.currentStock,
          requestedQuantity: requestedQuantity
        });
      }
    }

    // Si hay productos disponibles, crear ticket
    let ticket = null;
    if (productsAvailable.length > 0) {
      ticket = await ticketRepository.createTicket({
        amount: totalAmount,
        purchaser: userEmail,
        products: productsAvailable,
        productsUnavailable: productsUnavailable.length > 0 ? productsUnavailable : []
      });
    }

    // Actualizar carrito: mantener solo productos no disponibles
    if (productsUnavailable.length > 0) {
      const updatedProducts = productsUnavailable.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity
      }));
      await cartRepository.updateCart(cartId, updatedProducts);
    } else {
      // Si todos los productos fueron procesados, vaciar el carrito
      await cartRepository.clearCart(cartId);
    }

    return {
      ticket,
      productsAvailable: productsAvailable.length,
      productsUnavailable: productsUnavailable.length,
      totalAmount,
      completed: productsUnavailable.length === 0
    };
  }

  async getUserTickets(userEmail) {
    return await ticketRepository.getTicketsByPurchaser(userEmail);
  }

  async getTicketById(ticketId) {
    return await ticketRepository.getTicketById(ticketId);
  }
}

export default new PurchaseService();

