import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Product = mongoose.model('Product', ProductSchema); // <-- Aquí registramos el modelo correctamente
export default Product;
