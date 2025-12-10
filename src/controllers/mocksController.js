import { generateMockUsers, generateMockPets } from '../utils/mockingUtils.js';
import userRepository from '../repositories/userRepository.js';
import PetModel from '../models/Pet.js';

// Endpoint GET /mockingpets - Generar pets mockeados
export const getMockingPets = async (req, res) => {
  try {
    const { quantity = 100 } = req.query;
    const quantityNum = parseInt(quantity);
    
    if (isNaN(quantityNum) || quantityNum < 1 || quantityNum > 1000) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser un número entre 1 y 1000'
      });
    }
    
    const mockPets = generateMockPets(quantityNum);
    
    res.json({
      status: 'success',
      payload: mockPets,
      total: mockPets.length
    });
  } catch (error) {
    console.error('Error generando pets mockeados:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar pets mockeados',
      error: error.message
    });
  }
};

// Endpoint GET /mockingusers - Generar 50 usuarios mockeados
export const getMockingUsers = async (req, res) => {
  try {
    // Generar 50 usuarios como se especifica
    const mockUsers = generateMockUsers(50);
    
    // Formatear para que se parezca a una respuesta de MongoDB (sin guardar en BD)
    const formattedUsers = mockUsers.map((user, index) => ({
      _id: `mock_${Date.now()}_${index}_${Math.random().toString(36).substring(7)}`,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      password: user.password, // Ya encriptada
      role: user.role,
      pets: user.pets, // Array vacío
      cart: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    }));
    
    res.json({
      status: 'success',
      payload: formattedUsers,
      total: formattedUsers.length
    });
  } catch (error) {
    console.error('Error generando usuarios mockeados:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar usuarios mockeados',
      error: error.message
    });
  }
};

// Endpoint POST /generateData - Generar e insertar datos en la BD
export const generateData = async (req, res) => {
  try {
    const { users: usersQuantity = 0, pets: petsQuantity = 0 } = req.body;
    
    const usersNum = parseInt(usersQuantity);
    const petsNum = parseInt(petsQuantity);
    
    if (isNaN(usersNum) || usersNum < 0 || isNaN(petsNum) || petsNum < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros users y pets deben ser números válidos mayores o iguales a 0'
      });
    }
    
    const results = {
      users: {
        created: 0,
        errors: []
      },
      pets: {
        created: 0,
        errors: []
      }
    };
    
    // Generar e insertar usuarios
    if (usersNum > 0) {
      try {
        const mockUsers = generateMockUsers(usersNum);
        
        // Insertar usuarios uno por uno para manejar errores de email duplicado
        for (const userData of mockUsers) {
          try {
            // Verificar si el email ya existe
            const existingUser = await userRepository.getUserByEmail(userData.email);
            if (existingUser) {
              // Si existe, generar un email único
              userData.email = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}_${userData.email}`;
            }
            
            // Crear usuario (el repository crea el carrito automáticamente)
            await userRepository.createUser(userData);
            results.users.created++;
          } catch (error) {
            results.users.errors.push({
              email: userData.email,
              error: error.message
            });
          }
        }
      } catch (error) {
        results.users.errors.push({
          general: error.message
        });
      }
    }
    
    // Generar e insertar pets
    if (petsNum > 0) {
      try {
        const mockPets = generateMockPets(petsNum);
        
        // Insertar todos los pets
        const insertedPets = await PetModel.insertMany(mockPets, { ordered: false });
        results.pets.created = insertedPets.length;
      } catch (error) {
        // Si algunos se insertaron pero otros no
        if (error.insertedDocs) {
          results.pets.created = error.insertedDocs.length;
        }
        results.pets.errors.push({
          general: error.message
        });
      }
    }
    
    res.json({
      status: 'success',
      message: 'Datos generados e insertados en la base de datos',
      results: {
        users: {
          requested: usersNum,
          created: results.users.created,
          errors: results.users.errors.length > 0 ? results.users.errors : undefined
        },
        pets: {
          requested: petsNum,
          created: results.pets.created,
          errors: results.pets.errors.length > 0 ? results.pets.errors : undefined
        }
      }
    });
  } catch (error) {
    console.error('Error generando datos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar e insertar datos',
      error: error.message
    });
  }
};

