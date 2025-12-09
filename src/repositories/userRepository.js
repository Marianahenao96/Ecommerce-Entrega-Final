import userDAO from '../dao/userDAO.js';
import CartModel from '../models/Cart.js';
import bcrypt from 'bcrypt';

class UserRepository {
  async createUser(userData) {
    // Crear carrito para el usuario
    const newCart = await CartModel.create({ products: [] });
    
    const userWithCart = {
      ...userData,
      cart: newCart._id
    };
    
    return await userDAO.create(userWithCart);
  }

  async getUserById(id) {
    return await userDAO.findById(id);
  }

  async getUserByEmail(email) {
    // Esto ya excluye la contraseña automáticamente por el DAO
    return await userDAO.findOne({ email });
  }

  async getUserByEmailWithPassword(email) {
    return await userDAO.findOneWithPassword({ email });
  }

  async getUserByIdWithPassword(id) {
    return await userDAO.findByIdWithPassword(id);
  }

  async getAllUsers() {
    return await userDAO.findAll();
  }

  async updateUser(id, updateData) {
    return await userDAO.updateById(id, updateData);
  }

  async deleteUser(id) {
    const user = await userDAO.findByIdWithPassword(id);
    if (!user) return null;
    
    // Eliminar carrito asociado
    if (user.cart) {
      await CartModel.findByIdAndDelete(user.cart);
    }
    
    return await userDAO.deleteById(id);
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    return await userDAO.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async comparePassword(user, candidatePassword) {
    return bcrypt.compareSync(candidatePassword, user.password);
  }
}

export default new UserRepository();

