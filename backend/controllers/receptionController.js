import Reception from '../models/receptionModel.js';

// @desc    Create new reception
// @route   POST /api/receptions
// @access  Private
export const createReception = async (req, res) => {
  try {
    const { date, client, phone, model, type, brand, quotation } = req.body;
    const newReception = new Reception({
      date,
      client,
      phone,
      model,
      type,
      brand,
      quotation,
    });
    const savedReception = await newReception.save();
    res.status(201).json(savedReception);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};