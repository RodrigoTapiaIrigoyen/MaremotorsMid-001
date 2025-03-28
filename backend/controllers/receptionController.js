import Reception from '../models/ReceptionModel.js';

export const createReception = async (req, res) => {
  try {
    console.log(req.body); // Verificar los datos recibidos
    let reception = new Reception(req.body);
    reception = await reception.save();
    reception = await Reception.findById(reception._id).populate('client').populate('model');
    res.status(201).json(reception);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReception = async (req, res) => {
  try {
    console.log(req.body); // Verificar los datos recibidos
    let reception = await Reception.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client').populate('model');
    if (!reception) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.status(200).json(reception);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReceptions = async (req, res) => {
  try {
    const receptions = await Reception.find()
      .populate('client') // Poblamos el cliente
      .populate('model'); // Poblamos el modelo
    res.status(200).json(receptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReceptionById = async (req, res) => {
  try {
    const reception = await Reception.findById(req.params.id).populate('client').populate('model');
    if (!reception) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.status(200).json(reception);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReception = async (req, res) => {
  try {
    const reception = await Reception.findByIdAndDelete(req.params.id).populate('client').populate('model');
    if (!reception) {
      return res.status(404).json({ message: 'Recepción no encontrada' });
    }
    res.status(200).json({ message: 'Recepción eliminada' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const generatePDF = async (req, res) => {
  // Implementar la lógica para generar el PDF
};