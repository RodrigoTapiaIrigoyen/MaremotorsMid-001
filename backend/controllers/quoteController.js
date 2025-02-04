import Quote from '../models/QuoteModel.js';

// Obtener todas las cotizaciones
export const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las cotizaciones" });
  }
};

// Crear una nueva cotización
export const createQuote = async (req, res) => {
  const { reception, date, client, unit, document, status } = req.body;

  const newQuote = new Quote({ reception, date, client, unit, document, status });

  try {
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar la cotización', error: err });
  }
};

// Actualizar una cotización
export const updateQuote = async (req, res) => {
  const { id } = req.params;
  const { reception, date, client, unit, document, status } = req.body;

  try {
    const updatedQuote = await Quote.findByIdAndUpdate(id, { reception, date, client, unit, document, status }, { new: true });
    if (!updatedQuote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json(updatedQuote);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la cotización', error: err });
  }
};

// Eliminar una cotización
export const deleteQuote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la cotización', error: err });
  }
};
