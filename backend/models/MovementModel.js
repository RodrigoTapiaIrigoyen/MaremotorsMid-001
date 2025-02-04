import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    product: { type: String, required: true },
    partNumber: { type: String, required: true },
    type: { type: String, enum: ['entrada', 'salida'], required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    user: { type: String, required: true },
    comments: { type: String },
  },
  { timestamps: true } // Añadimos las fechas de creación y actualización
);

const Movement = mongoose.model('Movement', movementSchema);

export default Movement;