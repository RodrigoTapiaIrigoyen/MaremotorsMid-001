import mongoose from 'mongoose';

const receptionSchema = new mongoose.Schema({
  reception: { type: String, required: true },
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  phone: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  quotation: { type: Number, required: true },
  color: { type: String, required: true },
  plates: { type: String, required: true },
  accessories: {
    cabo: { type: Boolean, default: false },
    ancla: { type: Boolean, default: false },
    llaves: { type: Boolean, default: false },
    cover: { type: Boolean, default: false },
    chalecos: { type: Boolean, default: false },
    boyas: { type: Boolean, default: false },
    sinchos: { type: Boolean, default: false },
    gabeta: { type: Boolean, default: false },
    ventana: { type: Boolean, default: false },
    manguera: { type: Boolean, default: false },
    control: { type: Boolean, default: false },
    tapones: { type: Boolean, default: false },
  },
  aesthetics: {
    tablero: { type: Boolean, default: false },
    prende: { type: Boolean, default: false },
    manchado: { type: Boolean, default: false },
    agrietado: { type: Boolean, default: false },
    golpes: { type: Boolean, default: false },
    arranca: { type: Boolean, default: false },
    aceite: { type: Boolean, default: false },
    ibr: { type: Boolean, default: false },
    bateria: { type: Boolean, default: false },
  },
  issues: { type: String, required: true },
  observations: { type: String, required: true },
  trailer: {
    remolque: { type: Boolean, default: false },
    cambiar: { type: Boolean, default: false },
    winch: { type: Boolean, default: false },
    pata: { type: Boolean, default: false },
    baleros: { type: Boolean, default: false },
    tablas: { type: Boolean, default: false },
    luces: { type: Boolean, default: false },
    gomas: { type: Boolean, default: false },
    bases: { type: Boolean, default: false },
    us: { type: Boolean, default: false },
    tornilleria: { type: Boolean, default: false },
  },
  fuelTank: { type: String, required: true },
  kilometers: { type: String, required: true },
}, {
  timestamps: true,
});

const Reception = mongoose.model('Reception', receptionSchema);

export default Reception;