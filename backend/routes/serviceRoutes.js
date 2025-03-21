import express from 'express';
import { getAllServices, getServiceById,createService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.delete('/:id', deleteService);


export default router;