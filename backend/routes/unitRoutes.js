import express from 'express';
import { getUnits, createUnit, updateUnit, deleteUnit } from '../controllers/unitController.js';

const router = express.Router();

router.get('/', getUnits);
router.post('/', createUnit);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

export default router;