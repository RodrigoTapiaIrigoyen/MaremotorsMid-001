import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import quoteRoutes from './routes/quote.routes.js';

dotenv.config(); // Cargar las variables de entorno
console.log('Mongo URI:', process.env.MONGO_URI); // Verificar si se está cargando correctamente la URI

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware global ===
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Permitir solicitudes del frontend en el puerto 5173
app.use(bodyParser.json());

// === Conexión a MongoDB ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });

// === Rutas ===
app.use('/quotes', quoteRoutes);

app.get('/', (req, res) => {
  res.send('API de Maremotors funcionando');
});

// === Manejo de errores ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

// === Servidor ===
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
