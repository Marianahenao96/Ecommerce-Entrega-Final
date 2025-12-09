import ticketDAO from '../dao/ticketDAO.js';

class TicketRepository {
  async createTicket(ticketData) {
    const code = await ticketDAO.generateUniqueCode();
    const ticketWithCode = {
      ...ticketData,
      code
    };
    
    return await ticketDAO.create(ticketWithCode);
  }

  async getTicketById(id) {
    return await ticketDAO.findById(id);
  }

  async getTicketsByPurchaser(email) {
    return await ticketDAO.findByPurchaser(email);
  }
}

export default new TicketRepository();

