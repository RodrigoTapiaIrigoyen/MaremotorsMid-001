import Category from '../models/CategoryModel.js';

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

// Agregar una nueva categoría
export const addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error al agregar la categoría:', error);
    res.status(500).json({ message: 'Error al agregar la categoría' });
  }
};

// Eliminar una categoría por ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};