import UserModel from '../models/User.js';

class UserDAO {
  async create(userData) {
    return await UserModel.create(userData);
  }

  async findById(id) {
    return await UserModel.findById(id).select('-password').populate('cart');
  }

  async findOne(filter) {
    return await UserModel.findOne(filter).select('-password').populate('cart');
  }

  async findOneWithPassword(filter) {
    return await UserModel.findOne(filter);
  }

  async findByIdWithPassword(id) {
    return await UserModel.findById(id);
  }

  async findAll() {
    return await UserModel.find().select('-password').populate('cart');
  }

  async updateById(id, updateData) {
    return await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('cart');
  }

  async deleteById(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    return await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      ...options
    });
  }
}

export default new UserDAO();

