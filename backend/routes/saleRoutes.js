import express from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesStats
} from '../controllers/saleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSales)
  .post(protect, createSale);

router.get('/stats', protect, getSalesStats);

router.route('/:id')
  .get(protect, getSaleById)
  .put(protect, admin, updateSale)
  .delete(protect, admin, deleteSale);

export default router;