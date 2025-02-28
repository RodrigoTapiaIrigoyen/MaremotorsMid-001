// backend/controllers/receptionController.js
import Reception from '../models/ReceptionModel.js';

export const getReceptions = async (req, res) => {
  try {
    const receptions = await Reception.find().populate('client');
    res.json(receptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReception = async (req, res) => {
  const { reception, date, client, phone, model, type, brand, quotation, color, plates, accessories, aesthetics, issues, observations, trailer, fuelTank } = req.body;

  const newReception = new Reception({ reception, date, client, phone, model, type, brand, quotation, color, plates, accessories, aesthetics, issues, observations, trailer, fuelTank });

  try {
    await newReception.save();
    res.status(201).json(newReception);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReception = async (req, res) => {
  try {
    const updatedReception = await Reception.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReception);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReception = async (req, res) => {
  try {
    await Reception.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recepción eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generatePDF = async (req, res) => {
  // Implementar la lógica para generar el PDF
};