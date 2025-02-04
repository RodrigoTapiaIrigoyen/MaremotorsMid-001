import express from 'express';
import { getQuotes, createQuote, updateQuote, deleteQuote } from '../controllers/quoteController.js';

const router = express.Router();

// Ruta para obtener todas las cotizaciones
router.get("/", getQuotes);

// Ruta para crear una nueva cotización
router.post('/', createQuote);

// Ruta para actualizar una cotización
router.put('/:id', updateQuote);

// Ruta para eliminar una cotización
router.delete('/:id', deleteQuote);

export default router;
