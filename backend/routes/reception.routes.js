import express from 'express';
import Reception from '../models/ReceptionModel.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Obtener todas las recepciones
router.get('/', async (_req, res) => {
  try {
    const receptions = await Reception.find();
    res.json(receptions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las recepciones', error: err });
  }
});

// Crear una nueva recepción
router.post('/', async (req, res) => {
  try {
    const newReception = new Reception(req.body);
    await newReception.save();
    res.status(201).json(newReception);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la recepción', error: err });
  }
});

// Actualizar una recepción existente
router.put('/:id', async (req, res) => {
  try {
    const updatedReception = await Reception.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReception) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json(updatedReception);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la recepción', error: err });
  }
});

// Eliminar una recepción
router.delete('/:id', async (req, res) => {
  try {
    const deletedReception = await Reception.findByIdAndDelete(req.params.id);
    if (!deletedReception) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.json({ message: 'Recepción eliminada correctamente', deletedReception });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la recepción', error: err });
  }
});

export default router;