import productDAO from '../dao/productDAO.js';

class ProductRepository {
  async createProduct(productData) {
    // Validar código único
    const existingProduct = await productDAO.findOne({ code: productData.code });
    if (existingProduct) {
      throw new Error('Ya existe un producto con este código');
    }
    
    return await productDAO.create(productData);
  }

  async getProductById(id) {
    return await productDAO.findById(id);
  }

  async getProducts(filter = {}, options = {}) {
    return await productDAO.findAll(filter, options);
  }

  async updateProduct(id, updateData) {
    return await productDAO.updateById(id, updateData);
  }

  async deleteProduct(id) {
    const product = await productDAO.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return await productDAO.deleteById(id);
  }

  async checkStock(productId, requestedQuantity) {
    const product = await productDAO.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return {
      available: product.stock >= requestedQuantity,
      currentStock: product.stock,
      requested: requestedQuantity
    };
  }

  async decreaseStock(productId, quantity) {
    const product = await productDAO.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    
    product.stock -= quantity;
    return await productDAO.updateById(productId, { stock: product.stock });
  }

  async getProductByCode(code) {
    return await productDAO.findOne({ code });
  }
}

export default new ProductRepository();

