import TicketModel from '../models/Ticket.js';

class TicketDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  async findById(id) {
    return await TicketModel.findById(id).populate('products.product productsUnavailable.product');
  }

  async findByPurchaser(email) {
    return await TicketModel.find({ purchaser: email })
      .populate('products.product productsUnavailable.product')
      .sort({ purchase_datetime: -1 });
  }

  async findOne(filter) {
    return await TicketModel.findOne(filter);
  }

  async generateUniqueCode() {
    let code;
    let exists = true;
    
    while (exists) {
      code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const existingTicket = await this.findOne({ code });
      exists = !!existingTicket;
    }
    
    return code;
  }
}

export default new TicketDAO();

