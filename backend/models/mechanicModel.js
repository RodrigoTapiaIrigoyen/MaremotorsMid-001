import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

const Mechanic = mongoose.model("Mechanic", mechanicSchema);

export default Mechanic; // ✅ Exportación por defecto
