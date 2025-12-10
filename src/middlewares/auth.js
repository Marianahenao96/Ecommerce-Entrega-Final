import passport from 'passport';

// Middleware helper para autenticación que siempre devuelve JSON
export const authenticateJWT = (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Error en la autenticación',
        error: err.message
      });
    }
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado - Token inválido o expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

