import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import quoteRoutes from './routes/quote.routes.js';
import clientRoutes from './routes/client.routes.js'; // Importar rutas de clientes
import inventoryRoutes from './routes/inventory.routes.js'
import salesRoutes from './routes/sales.routes.js';
import mechanicRoutes from './routes/mechanicRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import movementRoutes from './routes/movement.routes.js'; // Asegúrate de que la ruta sea correcta
import receptionRoutes from './routes/reception.routes.js'; // Asegúrate de que la ruta sea correcta
import productRoutes from "./routes/productRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js"; // Importar rutas de servicios
import unitRoutes from './routes/unitRoutes.js';

import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Permitir ambos orígenes
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(morgan('dev'));
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });

  // Rutas
app.use('/api/quotes', quoteRoutes);
app.use('/api/clients', clientRoutes); // Registrar rutas de clientes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/receptions', receptionRoutes);
app.use('/api/products', productRoutes); // Conectar rutas de productos
app.use('/api/services', serviceRoutes); // Conectar rutas de servicios
app.use('/api/units', unitRoutes);

// Conexión a MongoDB

app.get('/', (req, res) => {
  res.send('API de Maremotors funcionando');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
