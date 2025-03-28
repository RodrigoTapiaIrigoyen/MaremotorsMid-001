import express from 'express';
import { addCategory, getCategories, deleteCategory } from '../controllers/categoryController.js';
import { addType, getTypes, deleteType } from '../controllers/typeController.js';
import { addSection, getSections, deleteSection } from '../controllers/sectionController.js';

const router = express.Router();

// Categorías
router.post('/categories', addCategory);
router.get('/categories', getCategories);
router.delete('/categories/:id', deleteCategory);

// Tipos
router.post('/types', addType);
router.get('/types', getTypes);
router.delete('/types/:id', deleteType);

// Secciones
router.post('/sections', addSection);
router.get('/sections', getSections);
router.delete('/sections/:id', deleteSection);

export default router;