import Quotation from '../models/QuoteModel.js';
import Reception from '../models/ReceptionModel.js';
import Sale from '../models/SalesModel.js';

export const getApprovedQuotes = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate('client', 'name');
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las cotizaciones' });
  }
};

export const getAllReceipts = async (req, res) => {
  try {
    const receptions = await Reception.find().populate('client', 'name');
    res.json(receptions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recepciones' });
  }
};

export const getApprovedSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('client', 'name');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};