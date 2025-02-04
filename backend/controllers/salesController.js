import Sale from "../models/SalesModel.js"; // Asegúrate de que el modelo está en la ruta correcta

// Obtener todas las ventas
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};

// Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const { product, quantity, totalPrice, date } = req.body;
    const newSale = new Sale({ product, quantity, totalPrice, date });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la venta" });
  }
};
// Actualizar una venta existente
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSale = await Sale.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSale) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la venta", error });
  }
};

// Eliminar una venta
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (!deletedSale) return res.status(404).json({ message: "Venta no encontrada" });
    res.json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la venta", error });
  }
};
