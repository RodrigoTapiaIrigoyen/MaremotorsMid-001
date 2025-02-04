import mongoose from 'mongoose';

const receptionSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quotation: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Reception = mongoose.model('Reception', receptionSchema);

export default Reception;