import express from 'express';
import { getAllServices, createService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);
router.delete('/:id', deleteService);

export default router;