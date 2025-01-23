import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    reception: String,
    date: String,
    client: String,
    unit: String,
    document: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'archived'],
      default: 'pending',
    },
  },
  { timestamps: true }
); // Agregar timestamps para manejar fechas de creación y actualización

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
