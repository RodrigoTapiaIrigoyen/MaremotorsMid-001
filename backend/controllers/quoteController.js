import Quote from '../models/QuoteModel.js';
import Product from '../models/productModel.js';
import Service from '../models/serviceModel.js';

// Obtener todas las cotizaciones
export const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().populate('items.productId').populate('items.serviceId');
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las cotizaciones" });
  }
};

// Crear una nueva cotización
export const createQuote = async (req, res) => {
  try {
    const { reception, date, client, user, mechanic, documentType, status, discount, items } = req.body;

    console.log('Received quote data:', req.body); // Agregar depuración aquí

    let totalWithoutDiscount = 0;

    for (const item of items) {
      if (item.type === 'product') {
        const product = await Product.findById(item.productId);
        if (product) {
          totalWithoutDiscount += product.price * item.quantity;
        } else {
          return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado` });
        }
      } else if (item.type === 'service') {
        const service = await Service.findById(item.serviceId);
        if (service) {
          totalWithoutDiscount += service.price * item.quantity;
        } else {
          return res.status(400).json({ message: `Servicio con ID ${item.serviceId} no encontrado` });
        }
      }
    }

    const total = totalWithoutDiscount - discount;

    // Si el status es 'approved', validar y descontar stock de productos
    if (status === 'approved') {
      for (const item of items) {
        if (item.type === 'product' && item.productId) {
          const product = await Product.findById(item.productId);
          if (!product) {
            return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado` });
          }
          // Validar que hay stock suficiente
          if (product.stock < item.quantity) {
            return res.status(400).json({ 
              message: `Stock insuficiente para el producto "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}` 
            });
          }
          // Descontar el stock
          product.stock -= item.quantity;
          await product.save();
          console.log(`Stock actualizado para producto ${product.name}: ${product.stock + item.quantity} -> ${product.stock}`);
        }
      }
    }

    const newQuote = new Quote({ reception, date, client, user, mechanic, documentType, status, discount, items, total });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    console.error('Error creating quote:', error); // Agregar depuración aquí
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una cotización
export const updateQuote = async (req, res) => {
  const { id } = req.params;
  const { reception, date, client, user, mechanic, documentType, status, discount, items } = req.body;

  try {
    // Verificar si la cotización existe
    const existingQuote = await Quote.findById(id);
    if (!existingQuote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    let totalWithoutDiscount = 0;

    for (const item of items) {
      if (item.type === 'product') {
        const product = await Product.findById(item.productId);
        if (product) {
          totalWithoutDiscount += product.price * item.quantity;
        } else {
          return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado` });
        }
      } else if (item.type === 'service') {
        const service = await Service.findById(item.serviceId);
        if (service) {
          totalWithoutDiscount += service.price * item.quantity;
        } else {
          return res.status(400).json({ message: `Servicio con ID ${item.serviceId} no encontrado` });
        }
      }
    }

    const total = totalWithoutDiscount - discount;

    // Si el status cambió a 'approved' y antes no lo estaba, descontar inventario
    const wasApproved = existingQuote.status === 'approved';
    const isNowApproved = status === 'approved';

    if (isNowApproved && !wasApproved) {
      // La cotización acaba de ser aprobada, descontar stock
      for (const item of items) {
        if (item.type === 'product' && item.productId) {
          const product = await Product.findById(item.productId);
          if (!product) {
            return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado` });
          }
          // Validar que hay stock suficiente
          if (product.stock < item.quantity) {
            return res.status(400).json({ 
              message: `Stock insuficiente para el producto "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}` 
            });
          }
          // Descontar el stock
          product.stock -= item.quantity;
          await product.save();
          console.log(`Stock actualizado para producto ${product.name}: ${product.stock + item.quantity} -> ${product.stock}`);
        }
      }
    }

    // Actualizar la cotización
    const updatedQuote = await Quote.findByIdAndUpdate(id, 
      { reception, date, client, user, mechanic, documentType, status, discount, total, items }, 
      { new: true }
    ).populate('items.productId').populate('items.serviceId');

    res.json(updatedQuote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la cotización', error: err });
  }
};

// Eliminar una cotización
export const deleteQuote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la cotización', error: err });
  }
};
// Obtener cotizaciones archivadas
export const getArchivedQuotes = async (req, res) => {
  try {
    const archivedQuotes = await Quote.find({ status: 'archived' })
      .populate('items.productId')
      .populate('items.serviceId');
    res.json(archivedQuotes);
  } catch (error) {
    console.error('Error al obtener cotizaciones archivadas:', error);
    res.status(500).json({ message: 'Error al obtener cotizaciones archivadas' });
  }
};