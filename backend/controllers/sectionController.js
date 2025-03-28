import Section from '../models/SectionModel.js';

// Obtener todas las secciones
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find();
    res.status(200).json(sections);
  } catch (error) {
    console.error('Error al obtener las secciones:', error);
    res.status(500).json({ message: 'Error al obtener las secciones' });
  }
};

// Agregar una nueva sección
export const addSection = async (req, res) => {
  const { name } = req.body;

  try {
    const existingSection = await Section.findOne({ name });
    if (existingSection) {
      return res.status(400).json({ message: 'La sección ya existe' });
    }

    const newSection = new Section({ name });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error al agregar la sección:', error);
    res.status(500).json({ message: 'Error al agregar la sección' });
  }
};

// Eliminar una sección por ID
export const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSection = await Section.findByIdAndDelete(id);
    if (!deletedSection) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }
    res.status(200).json({ message: 'Sección eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la sección:', error);
    res.status(500).json({ message: 'Error al eliminar la sección' });
  }
};