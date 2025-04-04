import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  minStock: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  subsection: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'used', 'refurbished'],
  },
  exchangeRate: {
    type: Number,
    required: true,
  },
  currencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true, 
  },
  manufacturer: {
    type: String, // O usa mongoose.Schema.Types.ObjectId si es una referencia
    required: true,
  },
});

// Middleware para verificar el stock antes de guardar
productSchema.pre("save", function (next) {
  if (this.stock <= this.minStock) {
    console.log(`Alerta: El stock del producto ${this.name} ha llegado al mínimo.`);
    // Aquí puedes agregar la lógica para enviar una alerta, como enviar un correo electrónico o una notificación
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;