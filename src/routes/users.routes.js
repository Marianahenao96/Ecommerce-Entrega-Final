import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// CRUD de usuarios
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:uid', getUserById);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);

export default router;

