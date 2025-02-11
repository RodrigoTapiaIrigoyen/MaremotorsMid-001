import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobada', 'cancelada'],
    default: 'pendiente',
  },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;