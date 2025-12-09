import userRepository from '../repositories/userRepository.js';
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
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario (el repository se encarga de crear el carrito)
    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role: role || 'user'
    });

    // Obtener usuario sin la contraseña
    const userResponse = await userRepository.getUserById(newUser._id);

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
    const users = await userRepository.getAllUsers();
    
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
    
    const user = await userRepository.getUserById(uid);
    
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

    const updatedUser = await userRepository.updateUser(uid, updateData);

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

    const deletedUser = await userRepository.deleteUser(uid);

    if (!deletedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado'
      });
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

    // Buscar usuario por email (con contraseña para validar)
    const user = await userRepository.getUserByEmailWithPassword(email);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await userRepository.comparePassword(user, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    // Obtener usuario sin la contraseña
    const userResponse = await userRepository.getUserById(user._id);

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

// Logout de usuario
export const logout = async (req, res) => {
  try {
    // En un sistema JWT sin sesiones del servidor, el logout se maneja en el cliente
    // eliminando el token. Sin embargo, podemos invalidar el token o simplemente
    // confirmar el logout exitoso.
    
    // Opcional: Si tienes una lista negra de tokens (blacklist), agregar el token aquí
    
    res.json({
      status: 'success',
      message: 'Logout exitoso. El token debe ser eliminado del cliente.'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en el logout',
      error: error.message
    });
  }
};

