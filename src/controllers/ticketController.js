import purchaseService from '../services/purchaseService.js';
import cartRepository from '../repositories/cartRepository.js';

// Procesar compra del carrito
export const processPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user.email;

    // Verificar que el carrito existe
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado'
      });
    }

    // Procesar la compra
    const result = await purchaseService.processPurchase(cid, userEmail);

    res.json({
      status: 'success',
      message: result.completed 
        ? 'Compra completada exitosamente' 
        : 'Compra parcialmente completada. Algunos productos no tenían stock suficiente',
      ticket: result.ticket,
      productsAvailable: result.productsAvailable,
      productsUnavailable: result.productsUnavailable,
      totalAmount: result.totalAmount,
      completed: result.completed
    });
  } catch (error) {
    console.error('Error en processPurchase:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar la compra',
      error: error.message
    });
  }
};

// Obtener tickets del usuario actual
export const getUserTickets = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const tickets = await purchaseService.getUserTickets(userEmail);

    res.json({
      status: 'success',
      tickets
    });
  } catch (error) {
    console.error('Error en getUserTickets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los tickets',
      error: error.message
    });
  }
};

// Obtener ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const { tid } = req.params;
    const ticket = await purchaseService.getTicketById(tid);

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket no encontrado'
      });
    }

    // Verificar que el ticket pertenece al usuario (o es admin)
    if (req.user.role !== 'admin' && ticket.purchaser !== req.user.email) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para ver este ticket'
      });
    }

    res.json({
      status: 'success',
      ticket
    });
  } catch (error) {
    console.error('Error en getTicketById:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener el ticket',
      error: error.message
    });
  }
};

