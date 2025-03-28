import Sale from '../models/SalesModel.js';
import Product from '../models/productModel.js';
import Client from '../models/ClientModel.js';

// Obtener todas las ventas
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('products.product').populate('client');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error });
  }
};

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const { products, total, date, status, client } = req.body;
    // Validar el estado
    if (!['pendiente', 'aprobada', 'archivada'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido para la venta' });
    }

    // Validar el cliente
    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({ message: `Cliente con ID ${client} no encontrado` });
    }

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
      client,
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
  const { products, total, date, status, client } = req.body;

  try {
    // Validar el estado
    if (!['pendiente', 'aprobada', 'archivada'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido para la venta' });
    }

    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { products, total, date, status, client },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

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
// Aprobar una venta
export const approveSale = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findByIdAndUpdate(
      id,
      { status: 'aprobada' }, // Cambiar el estado a "aprobada"
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar la venta', error });
  }
};

// Obtener ventas archivadas
export const getArchivedSales = async (req, res) => {
  try {
    const archivedSales = await Sale.find({ status: 'archivada' })
      .populate('products.product')
      .populate('client');
    res.status(200).json(archivedSales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas archivadas', error });
  }
};