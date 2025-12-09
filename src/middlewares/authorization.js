// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Usuario no autenticado'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'No autorizado - Se requieren permisos de administrador'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en la autorización',
      error: error.message
    });
  }
};

// Middleware para verificar si el usuario es un usuario regular (no admin)
export const isUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Usuario no autenticado'
      });
    }

    if (req.user.role !== 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'No autorizado - Esta acción solo está disponible para usuarios regulares'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en la autorización',
      error: error.message
    });
  }
};

// Middleware para verificar que el usuario es el propietario del recurso o es admin
export const isOwnerOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Usuario no autenticado'
      });
    }

    // Los administradores pueden hacer cualquier cosa
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar que el usuario es el propietario del recurso
    const resourceUserId = req.params.uid || req.body.userId;
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({
        status: 'error',
        message: 'No autorizado - Solo puedes acceder a tus propios recursos'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en la autorización',
      error: error.message
    });
  }
};

