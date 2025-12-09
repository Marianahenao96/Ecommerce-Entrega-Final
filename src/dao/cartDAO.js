import CartModel from '../models/Cart.js';

class CartDAO {
  async create(cartData) {
    return await CartModel.create(cartData);
  }

  async findById(id) {
    return await CartModel.findById(id);
  }

  async findByIdPopulated(id) {
    return await CartModel.findById(id).populate('products.product').lean();
  }

  async updateById(id, updateData) {
    return await CartModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async findByIdAndUpdate(id, updateData) {
    return await CartModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('products.product');
  }

  async deleteById(id) {
    return await CartModel.findByIdAndDelete(id);
  }

  async save(cart) {
    return await cart.save();
  }
}

export default new CartDAO();

