import express from 'express';
import { getExchangeRates, createExchangeRate } from '../controllers/exchangeRateController.js';

const router = express.Router();

router.get('/', getExchangeRates);
router.post('/', createExchangeRate);

export default router;