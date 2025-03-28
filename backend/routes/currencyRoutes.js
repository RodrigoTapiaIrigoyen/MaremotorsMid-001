import express from 'express';
import { getCurrencies, createCurrency, getCurrencyById, deleteCurrency } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/', getCurrencies);
router.post('/', createCurrency);
router.get("/currencies/:id", getCurrencyById);
router.delete("/:id", deleteCurrency);

export default router;