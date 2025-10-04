import ProductModel from '../models/Product.js';

// Obtener productos con paginación
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;

    const result = await ProductModel.paginate({}, { page, limit, lean: true });

    res.render('products', {
      products: result.docs,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null
    });
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    res.status(500).send('Error al cargar productos');
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    res.status(500).send('Error al obtener producto');
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    res.status(500).send('Error al crear producto');
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).send('Producto no encontrado');
    res.json(updated);
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    res.status(500).send('Error al actualizar producto');
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).send('Producto no encontrado');
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    res.status(500).send('Error al eliminar producto');
  }
};
