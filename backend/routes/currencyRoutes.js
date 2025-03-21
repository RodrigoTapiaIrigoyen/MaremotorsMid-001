import express from 'express';
import { getCurrencies, createCurrency } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/', getCurrencies);
router.post('/', createCurrency);

export default router;