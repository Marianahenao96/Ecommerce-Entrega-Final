// src/controllers/productController.js
import ProductModel from '../models/product.js';

// 🟢 Obtener productos con filtros, orden y paginación
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // --- Filtro ---
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: query },
          {
            status:
              query === 'available'
                ? true
                : query === 'unavailable'
                ? false
                : undefined,
          },
        ],
      };
    }

    // --- Ordenamiento ---
    let sortOption = {};
    if (sort === 'asc') sortOption = { price: 1 };
    else if (sort === 'desc') sortOption = { price: -1 };

    // --- Consulta con paginación ---
    const result = await ProductModel.paginate(filter, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    });

    // --- Construcción de links ---
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}`
      : null;

    // --- Si la ruta es API → JSON; si es vista → renderiza ---
    if (req.originalUrl.startsWith('/api/')) {
      res.json({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink,
      });
    } else {
      // 👇 Esta es la parte que se ajustó
      res.render('products', {
        products: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink,
      });
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error al cargar productos' });
  }
};

// 🟢 Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product)
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });

    res.render('productDetail', { product });
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error al obtener producto' });
  }
};

// 🟢 Crear nuevo producto
export const createProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({
      status: 'success',
      payload: newProduct,
    });
  } catch (error) {
    console.error('❌ Error creando producto:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear producto',
      error: error.message,
    });
  }
};

// 🟢 Actualizar producto existente
export const updateProduct = async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });

    res.json({ status: 'success', payload: updated });
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error al actualizar producto' });
  }
};

// 🟢 Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!deleted)
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });

    res.json({
      status: 'success',
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Error al eliminar producto' });
  }
};
