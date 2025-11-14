import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Opciones para la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'tu_secret_key_super_segura_cambiar_en_produccion'
};

// Estrategia JWT para autenticación
passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Buscar el usuario por el ID del payload del token
      const user = await UserModel.findById(payload.userId).select('-password');
      
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia "current" para validar usuario logueado
passport.use(
  'current',
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Buscar el usuario por el ID del payload del token
      const user = await UserModel.findById(payload.userId).select('-password');
      
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Función para generar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'tu_secret_key_super_segura_cambiar_en_produccion',
    { expiresIn: '24h' }
  );
};

export default passport;

