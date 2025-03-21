import express from 'express';
import mongoose from 'mongoose';
import Client from '../models/ClientModel.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Obtener todos los clientes
router.get('/', async (req, res) => {  // Cambié /clients por solo / porque el prefijo ya se agrega desde server.js
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: err });
  }
});
// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: err });
  }
});
// Crear un nuevo cliente
router.post('/', async (req, res) => {  // Aquí igual, sin el prefijo '/clients'
  try {
    const { _id, ...data } = req.body; // Elimina cualquier _id del body
    const newClient = new Client(data);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente', error });
  }
});

// Actualizar un cliente existente
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, address },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ message: 'Error al editar el cliente', error: err });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente', deletedClient });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: err });
  }
});

export default router;