import { Router } from 'express';
import PetModel from '../models/Pet.js';

const router = Router();

// GET /api/pets - Obtener todos los pets
router.get('/', async (req, res) => {
  try {
    const pets = await PetModel.find().populate('owner').lean();
    
    res.json({
      status: 'success',
      payload: pets,
      total: pets.length
    });
  } catch (error) {
    console.error('Error obteniendo pets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener pets',
      error: error.message
    });
  }
});

// GET /api/pets/:pid - Obtener pet por ID
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const pet = await PetModel.findById(pid).populate('owner').lean();
    
    if (!pet) {
      return res.status(404).json({
        status: 'error',
        message: 'Pet no encontrado'
      });
    }
    
    res.json({
      status: 'success',
      payload: pet
    });
  } catch (error) {
    console.error('Error obteniendo pet:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener pet',
      error: error.message
    });
  }
});

export default router;




