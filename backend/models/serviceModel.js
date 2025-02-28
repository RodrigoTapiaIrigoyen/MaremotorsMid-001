import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  currency: { type: String, required: true, default: 'MXN' },
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;