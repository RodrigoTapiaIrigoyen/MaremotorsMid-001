import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  reception: String,
  date: Date,
  client: String,
  unit: String,
  document: String,
  status: String,
});

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;
