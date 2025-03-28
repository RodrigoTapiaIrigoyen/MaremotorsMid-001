import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Section = mongoose.model('Section', sectionSchema);

export default Section;