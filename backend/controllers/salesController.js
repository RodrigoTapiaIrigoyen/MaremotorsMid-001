import Sale from '../models/SalesModel.js';
import Product from '../models/productModel.js';

// Obtener todas las ventas
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('products.product');
    console.log(sales); // Agregar este console.log para inspeccionar los datos
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const { products, total, date, status } = req.body;

    // Validar los productos
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.product} no encontrado` });
      }

      // Actualizar el stock del producto
      product.quantity -= item.quantity;
      await product.save();
    }

    // Crear la venta
    const newSale = new Sale({
      products,
      total,
      date,
      status,
    });
    await newSale.save();

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
};

// Actualizar una venta existente
export const updateSale = async (req, res) => {
  const { id } = req.params;
  const { products, total, date, status } = req.body;

  try {
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { products, total, date, status },
      { new: true }
    );
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta', error });
  }
};

// Eliminar una venta
export const deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    await Sale.findByIdAndDelete(id);
    res.json({ message: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error });
  }
};