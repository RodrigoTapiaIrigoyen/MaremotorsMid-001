import express from 'express';
import { getQuotes, createQuote, updateQuote, deleteQuote } from '../controllers/quoteController.js';

const router = express.Router();

// Ruta para obtener todas las cotizaciones
router.get("/", getQuotes);

// Crear una nueva cotización
router.post('/', createQuote);

// Actualizar una cotización existente
router.put('/:id', updateQuote);

// Eliminar una cotización
router.delete('/:id', deleteQuote);

export default router;