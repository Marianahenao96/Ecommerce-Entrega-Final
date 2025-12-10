import { Router } from 'express';
import {
  getMockingPets,
  getMockingUsers,
  generateData
} from '../controllers/mocksController.js';

const router = Router();

// GET /api/mocks/mockingpets - Generar pets mockeados
router.get('/mockingpets', getMockingPets);

// GET /api/mocks/mockingusers - Generar 50 usuarios mockeados
router.get('/mockingusers', getMockingUsers);

// POST /api/mocks/generateData - Generar e insertar datos en la BD
router.post('/generateData', generateData);

// Manejar GET en /generateData para dar instrucciones
router.get('/generateData', (req, res) => {
  res.status(405).json({
    status: 'error',
    message: 'Este endpoint requiere método POST. Usa POST con el body: { "users": 10, "pets": 20 }',
    example: {
      method: 'POST',
      url: '/api/mocks/generateData',
      body: {
        users: 10,
        pets: 20
      }
    }
  });
});

export default router;

