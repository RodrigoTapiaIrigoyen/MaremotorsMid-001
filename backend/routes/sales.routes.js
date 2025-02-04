import express from 'express';
import { getSales, createSale, updateSale, deleteSale } from '../controllers/salesController.js';

const router = express.Router();

// Obtener todas las ventas
router.get('/', getSales);

// Crear una nueva venta
router.post('/', createSale);

// Actualizar una venta existente
router.put('/:id', updateSale);

// Eliminar una venta
router.delete('/:id', deleteSale);

export default router;