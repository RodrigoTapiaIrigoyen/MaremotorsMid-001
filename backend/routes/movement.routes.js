import express from 'express';
import mongoose from 'mongoose';
import Movement from '../models/MovementModel.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Obtener todos los movimientos
router.get('/', async (req, res) => {
  try {
    const movements = await Movement.find();
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los movimientos', error: err });
  }
});

// Crear un nuevo movimiento
router.post('/', async (req, res) => {
  try {
    const newMovement = new Movement(req.body);
    await newMovement.save();
    res.status(201).json(newMovement);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el movimiento', error: err });
  }
});

// Actualizar un movimiento existente
router.put('/:id', async (req, res) => {
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json(updatedMovement);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el movimiento', error: err });
  }
});

// Eliminar un movimiento
router.delete('/:id', async (req, res) => {
  try {
    const deletedMovement = await Movement.findByIdAndDelete(req.params.id);
    if (!deletedMovement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json({ message: 'Movimiento eliminado correctamente', deletedMovement });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el movimiento', error: err });
  }
});

export default router;