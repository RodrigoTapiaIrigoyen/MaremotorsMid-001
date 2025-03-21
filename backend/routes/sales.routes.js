import express from 'express';
import { getSales, createSale, updateSale, deleteSale, approveSale } from '../controllers/salesController.js';

const router = express.Router();

router.get('/', getSales);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);


// Nueva ruta para aprobar una venta
router.put('/:id/approve', approveSale);

export default router;