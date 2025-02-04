import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;