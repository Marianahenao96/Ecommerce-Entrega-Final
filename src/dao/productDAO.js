import ProductModel from '../models/Product.js';

class ProductDAO {
  async create(productData) {
    return await ProductModel.create(productData);
  }

  async findById(id) {
    return await ProductModel.findById(id).lean();
  }

  async findOne(filter) {
    return await ProductModel.findOne(filter);
  }

  async findAll(filter = {}, options = {}) {
    return await ProductModel.paginate(filter, options);
  }

  async updateById(id, updateData) {
    return await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  async findByIdAndUpdate(id, updateData) {
    return await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }
}

export default new ProductDAO();

