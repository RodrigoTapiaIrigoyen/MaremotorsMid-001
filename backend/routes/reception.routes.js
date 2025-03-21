import express from 'express';
import { getReceptions, createReception, updateReception, deleteReception, generatePDF } from '../controllers/receptionController.js';

const router = express.Router();

router.get('/', getReceptions);
router.post('/', createReception);
router.put('/:id', updateReception);
router.delete('/:id', deleteReception);
router.get('/:id/pdf', generatePDF);

export default router;