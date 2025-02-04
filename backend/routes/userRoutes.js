import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authUser,
} from '../controllers/userController.js';

const router = express.Router();

// Ruta para login (autenticación)
router.route('/login').post(authUser); // Ruta de autenticación para obtener un token

// Rutas protegidas y públicas
router.route('/')
  .get(protect, admin, getUsers) // Aseguramos que primero se autentique el usuario
  .post(createUser); // Ruta para crear un nuevo usuario

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;