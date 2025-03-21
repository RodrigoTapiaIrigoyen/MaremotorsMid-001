import Unit from '../models/UnitModel.js';

// Obtener todas las unidades
export const getUnits = async (req, res) => {
  try {
    const units = await Unit.find().populate('client', 'name');
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva unidad
export const createUnit = async (req, res) => {
  const { model, type, brand, color, plates, client } = req.body;

  const newUnit = new Unit({ model, type, brand, color, plates, client });

  try {
    await newUnit.save();
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateUnit = async (req, res) => {
  const { id } = req.params;
  const { model, type, brand, color, plates, client } = req.body;

  if (!model || !type || !brand || !color || !plates || !client) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      { model, type, brand, color, plates, client },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unidad no encontrada.' });
    }

    res.status(200).json(updatedUnit);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la unidad.', error });
  }
};

// Eliminar una unidad
export const deleteUnit = async (req, res) => {
  const { id } = req.params;

  try {
    await Unit.findByIdAndDelete(id);
    res.status(200).json({ message: 'Unidad eliminada' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};