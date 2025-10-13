import ProductModel from '../models/Product.js';

// ✅ Obtener todos los productos con paginación y filtros
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir filtros basados en query
    let filter = {};
    if (query) {
      if (query === 'available') {
        filter = { stock: { $gt: 0 }, status: true };
      } else {
        // Validar que la categoría sea válida
        const validCategories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'automotive', 'other'];
        if (validCategories.includes(query)) {
          filter = { category: query, status: true };
        } else {
          // Si la categoría no es válida, mostrar todos los productos activos
          filter = { status: true };
        }
      }
    } else {
      // Por defecto, mostrar solo productos activos
      filter = { status: true };
    }

    // Configurar opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };

    // Agregar ordenamiento si se especifica
    if (sort && (sort === 'asc' || sort === 'desc')) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    // Realizar la consulta con paginación
    const result = await ProductModel.paginate(filter, options);

    // Formatear respuesta según especificaciones
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage 
        ? `?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` 
        : null,
      nextLink: result.hasNextPage 
        ? `?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` 
        : null,
    };

    // Si es una petición de API, devolver JSON
    if (req.path.startsWith('/api/')) {
      return res.json(response);
    }

    // Si es una vista, renderizar con los datos
    res.render('products', {
      title: 'Lista de productos',
      ...response,
      products: result.docs, // Para compatibilidad con la vista existente
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    
    const errorResponse = {
      status: 'error',
      message: 'Error al obtener productos'
    };

    if (req.path.startsWith('/api/')) {
      return res.status(500).json(errorResponse);
    }
    
    res.status(500).send('Error al obtener productos');
  }
};

// ✅ Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      }
      return res.status(404).send('Producto no encontrado');
    }

    // Si es una petición de API, devolver JSON
    if (req.path.startsWith('/api/')) {
      return res.json({ status: 'success', payload: product });
    }

    // Si es una vista, renderizar
    res.render('productDetail', { 
      title: product.title,
      product 
    });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
    }
    
    res.status(500).send('Error al obtener producto');
  }
};

// ✅ Crear producto
export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    // Validaciones
    if (!title || !description || !code || !price || !stock || !category) {
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Todos los campos obligatorios deben ser completados' 
        });
      }
      return res.status(400).send('Todos los campos son obligatorios');
    }

    // Validar que el código sea único
    const existingProduct = await ProductModel.findOne({ code });
    if (existingProduct) {
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Ya existe un producto con este código' 
        });
      }
      return res.status(400).send('Ya existe un producto con este código');
    }

    // Validar precio y stock
    if (parseFloat(price) < 0) {
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'El precio no puede ser negativo' 
        });
      }
      return res.status(400).send('El precio no puede ser negativo');
    }

    if (parseInt(stock) < 0) {
      if (req.path.startsWith('/api/')) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'El stock no puede ser negativo' 
        });
      }
      return res.status(400).send('El stock no puede ser negativo');
    }

    // Procesar imágenes
    let processedThumbnails = [];
    if (thumbnails && thumbnails.trim()) {
      processedThumbnails = thumbnails
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    }

    // Crear el producto
    const product = await ProductModel.create({
      title: title.trim(),
      description: description.trim(),
      code: code.trim().toUpperCase(),
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category.trim(),
      status: status === 'true' || status === true,
      thumbnails: processedThumbnails,
    });

    console.log('✅ Producto creado:', product);

    if (req.path.startsWith('/api/')) {
      return res.status(201).json({ 
        status: 'success', 
        message: 'Producto creado exitosamente',
        payload: product
      });
    }

    res.redirect('/products');
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Error interno del servidor al crear producto' 
      });
    }
    
    res.status(500).send('Error al crear producto');
  }
};

// ✅ Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await ProductModel.findByIdAndUpdate(pid, req.body, { new: true });
    if (!result) return res.status(404).send('Producto no encontrado');
    res.redirect('/products');
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).send('Error al actualizar producto');
  }
};

// ✅ Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await ProductModel.findByIdAndDelete(pid);
    if (!result) return res.status(404).send('Producto no encontrado');
    res.redirect('/products');
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).send('Error al eliminar producto');
  }
};

// ✅ Disminuir stock
export const decreaseStock = async (req, res) => {
  try {
    const { pid } = req.params;
    const { amount } = req.body;
    const product = await ProductModel.findById(pid);

    if (!product) return res.status(404).send('Producto no encontrado');

    product.stock = Math.max(product.stock - (Number(amount) || 1), 0);
    await product.save();

    res.redirect('/products');
  } catch (error) {
    console.error('❌ Error al reducir stock:', error);
    res.status(500).send('Error al modificar el stock');
  }
};
