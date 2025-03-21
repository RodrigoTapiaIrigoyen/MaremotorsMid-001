import express from 'express';
import { getApprovedQuotes, getAllReceipts, getApprovedSales } from '../controllers/reports.controller.js';

const router = express.Router();

router.get('/quotes', getApprovedQuotes);
router.get('/receptions', getAllReceipts);
router.get('/sales', getApprovedSales);


export default router;