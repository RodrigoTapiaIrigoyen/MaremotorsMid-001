import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getMovements } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/movements', getMovements);

export default router;