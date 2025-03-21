import Product from '../models/productModel.js';
import Movement from '../models/MovementModel.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('currencyId');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};
// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      partNumber,
      price,
      stock,
      minStock,
      section,
      subsection,
      purchasePrice,
      condition,
      currencyId,
      exchangeRate
    } = req.body;

    const newProduct = new Product({
      name,
      partNumber,
      price,
      stock,
      minStock,
      section,
      subsection,
      purchasePrice,
      condition,
      currencyId,
      exchangeRate
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const {
    name,
    partNumber,
    price,
    stock,
    minStock,
    section,
    subsection,
    purchasePrice,
    condition,
    currencyId,
    exchangeRate
  } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        partNumber,
        price,
        stock,
        minStock,
        section,
        subsection,
        purchasePrice,
        condition,
        currencyId,
        exchangeRate // Añadir tasa de cambio
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

// Obtener movimientos de productos
export const getMovements = async (req, res) => {
  try {
    const movements = await Movement.find({ productId: req.params.id });
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los movimientos', error });
  }
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMovements,
};