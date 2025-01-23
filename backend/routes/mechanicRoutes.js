import express from 'express';
import {
  getMechanics,
  getMechanicById,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  addTask,
  updateTaskStatus
} from '../controllers/mechanicController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMechanics)
  .post(protect, admin, createMechanic);

router.route('/:id')
  .get(protect, getMechanicById)
  .put(protect, admin, updateMechanic)
  .delete(protect, admin, deleteMechanic);

router.route('/:id/tasks')
  .post(protect, addTask);

router.route('/:id/tasks/:taskId')
  .put(protect, updateTaskStatus);

export default router;