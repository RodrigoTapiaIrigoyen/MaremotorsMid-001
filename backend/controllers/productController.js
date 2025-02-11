import Product from '../models/productModel.js';
import Movement from '../models/MovementModel.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, minStock, section, subsection } = req.body;
    const newProduct = new Product({ name, price, stock, minStock, section, subsection });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, minStock, section, subsection } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, minStock, section, subsection },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

// Obtener movimientos de productos
export const getMovements = async (req, res) => {
  try {
    const movements = await Movement.find().populate('product');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los movimientos', error });
  }
};