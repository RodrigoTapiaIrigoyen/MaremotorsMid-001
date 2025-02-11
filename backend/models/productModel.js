import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
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