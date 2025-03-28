import Type from '../models/TypeModel.js';

// Obtener todos los tipos
export const getTypes = async (req, res) => {
  try {
    const types = await Type.find();
    res.status(200).json(types);
  } catch (error) {
    console.error('Error al obtener los tipos:', error);
    res.status(500).json({ message: 'Error al obtener los tipos' });
  }
};

// Agregar un nuevo tipo
export const addType = async (req, res) => {
  const { name } = req.body;

  try {
    const existingType = await Type.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: 'El tipo ya existe' });
    }

    const newType = new Type({ name });
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    console.error('Error al agregar el tipo:', error);
    res.status(500).json({ message: 'Error al agregar el tipo' });
  }
};

// Eliminar un tipo por ID
export const deleteType = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedType = await Type.findByIdAndDelete(id);
    if (!deletedType) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }
    res.status(200).json({ message: 'Tipo eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el tipo:', error);
    res.status(500).json({ message: 'Error al eliminar el tipo' });
  }
};