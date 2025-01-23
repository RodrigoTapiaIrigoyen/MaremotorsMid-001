import Quote from '../models/Quote.js';

export const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cotizaciones' });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote)
      return res.status(404).json({ message: 'Cotización no encontrada' });
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cotización' });
  }
};

export const createQuote = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newQuote = new Quote({ name, description });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cotización' });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedQuote)
      return res.status(404).json({ message: 'Cotización no encontrada' });
    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cotización' });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
    if (!deletedQuote)
      return res.status(404).json({ message: 'Cotización no encontrada' });
    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cotización' });
  }
};

export const archiveQuote = async (req, res) => {
  try {
    const archivedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    if (!archivedQuote)
      return res.status(404).json({ message: 'Cotización no encontrada' });
    res.json(archivedQuote);
  } catch (error) {
    res.status(500).json({ message: 'Error al archivar la cotización' });
  }
};
