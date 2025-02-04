import express from 'express';
import { body, validationResult } from 'express-validator';
import Inventory from '../models/inventory.model.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inventario', error });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Inventory.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
});

// Agregar un producto
router.post(
  '/',
  [
    body('productName').notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newProduct = new Inventory(req.body);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: 'Error al agregar el producto', error });
    }
  }
);

// Actualizar un producto por ID
router.put(
  '/:id',
  [
    body('productName').optional().notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price').optional().isNumeric().withMessage('El precio debe ser un número'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedProduct = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el producto', error });
    }
  }
);

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
});

export default router;