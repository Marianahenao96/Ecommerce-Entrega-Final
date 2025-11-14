import UserModel from '../models/User.js';
import CartModel from '../models/Cart.js';
import { generateToken } from '../config/passport.config.js';

// CRUD de Usuarios

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos son requeridos (first_name, last_name, email, age, password)'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear carrito para el usuario
    const newCart = await CartModel.create({ products: [] });

    // Crear usuario (la contraseña se encriptará automáticamente en el pre-save hook)
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password, // Se encriptará automáticamente
      cart: newCart._id,
      role: role || 'user'
    });

    // Obtener usuario sin la contraseña
    const userResponse = await UserModel.findById(newUser._id).select('-password').populate('cart');

    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitosamente',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').populate('cart');
    
    res.json({
      status: 'success',
      users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    
    const user = await UserModel.findById(uid).select('-password').populate('cart');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { first_name, last_name, email, age, role } = req.body;

    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (role) updateData.role = role;

    const updatedUser = await UserModel.findByIdAndUpdate(
      uid,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('cart');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(uid);

    if (!deletedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
    }

    // Opcional: eliminar el carrito asociado
    if (deletedUser.cart) {
      await CartModel.findByIdAndDelete(deletedUser.cart);
    }

    res.json({
      status: 'success',
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    // Obtener usuario sin la contraseña
    const userResponse = await UserModel.findById(user._id).select('-password').populate('cart');

    res.json({
      status: 'success',
      message: 'Login exitoso',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el login',
      error: error.message
    });
  }
};

