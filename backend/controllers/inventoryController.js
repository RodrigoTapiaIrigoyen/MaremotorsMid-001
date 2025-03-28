import Product from '../models/productModel.js';

// Obtener productos organizados por secciones y subsecciones
export const getInventory = async (req, res) => {
  try {
    const products = await Product.find();
    const inventory = products.reduce((acc, product) => {
      const { section, subsection } = product;

      // Usa directamente el nombre de la sección
      if (!acc[section]) {
        acc[section] = {};
      }
      if (!acc[section][subsection]) {
        acc[section][subsection] = [];
      }
      acc[section][subsection].push(product);
      return acc;
    }, {});

    // Ordenar secciones y subsecciones alfabéticamente
    const sortedInventory = Object.keys(inventory).sort().reduce((acc, section) => {
      acc[section] = Object.keys(inventory[section]).sort().reduce((subAcc, subsection) => {
        subAcc[subsection] = inventory[section][subsection];
        return subAcc;
      }, {});
      return acc;
    }, {});

    res.json(sortedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inventario', error });
  }
};

// Crear un nuevo elemento de inventario
export const createInventory = async (req, res) => {
  try {
    const { productId, section, subsection } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Usa directamente el nombre de la sección
    product.section = section;
    product.subsection = subsection;
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el inventario', error });
  }
};

// Actualizar un elemento de inventario existente
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { section, subsection } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Usa directamente el nombre de la sección
    product.section = section;
    product.subsection = subsection;
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el inventario', error });
  }
};

// Eliminar un elemento de inventario
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el inventario', error });
  }
};