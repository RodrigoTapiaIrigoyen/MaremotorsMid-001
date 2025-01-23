import express from 'express';
import Quote from '../models/QuoteModel'; // Asegúrate de importar correctamente el modelo

const router = express.Router();

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al obtener las cotizaciones', error: err });
  }
});

// Crear una nueva cotización
router.post('/', async (req, res) => {
  const { reception, date, client, unit, document, status } = req.body;

  const newQuote = new Quote({
    reception,
    date,
    client,
    unit,
    document,
    status,
  });

  try {
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote); // Devuelve la cotización guardada
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al guardar la cotización', error: err });
  }
});

// Editar una cotización
router.put('/:id', async (req, res) => {
  const { reception, date, client, unit, document, status } = req.body;

  try {
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { reception, date, client, unit, document, status },
      { new: true } // Retorna el documento actualizado
    );
    res.json(updatedQuote);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al editar la cotización', error: err });
  }
});

// Eliminar una cotización
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cotización eliminada correctamente', deletedQuote });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al eliminar la cotización', error: err });
  }
});

export default router;
