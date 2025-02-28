import mongoose from 'mongoose';
import Product from './productModel.js';
import Service from './serviceModel.js';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  quantity: { type: Number, required: true, default: 1 },
  type: { type: String, required: true, enum: ['product', 'service'] }
});

const quoteSchema = new mongoose.Schema({
  reception: { type: String, required: true },
  date: { type: Date, required: true },
  client: { type: String, required: true },
  user: { type: String, required: true },
  mechanic: { type: String, required: true },
  documentType: { type: String, required: true, enum: ['fiscal', 'no fiscal'] },
  status: { type: String, required: true, enum: ['pending', 'approved'] },
  discount: { type: Number, required: true, default: 0 },
  items: [itemSchema],
  total: { type: Number, required: true, default: 0 },
});

// Middleware para calcular el total antes de validar
quoteSchema.pre('validate', async function (next) {
  let totalWithoutDiscount = 0;

  try {
    for (let item of this.items) {
      let itemTotal = 0;

      if (item.type === 'product' && item.productId) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return next(new Error(`Producto con ID ${item.productId} no encontrado.`));
        }
        if (typeof product.price !== 'number') {
          return next(new Error(`El producto ${product.name} no tiene precio válido.`));
        }
        itemTotal = product.price * item.quantity;
      }

      if (item.type === 'service' && item.serviceId) {
        const service = await Service.findById(item.serviceId);
        if (!service) {
          return next(new Error(`Servicio con ID ${item.serviceId} no encontrado.`));
        }
        if (typeof service.price !== 'number') {
          return next(new Error(`El servicio ${service.name} no tiene precio válido.`));
        }
        itemTotal = service.price * item.quantity;
      }

      totalWithoutDiscount += itemTotal;
    }

    this.total = totalWithoutDiscount - this.discount;

    if (isNaN(this.total)) {
      return next(new Error(`Error en el cálculo del total: ${totalWithoutDiscount} - ${this.discount} resultó en NaN.`));
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;