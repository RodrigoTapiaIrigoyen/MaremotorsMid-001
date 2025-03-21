import mongoose from 'mongoose';

const unitSchema = mongoose.Schema({
  model: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  plates: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
}, {
  timestamps: true,
});

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;