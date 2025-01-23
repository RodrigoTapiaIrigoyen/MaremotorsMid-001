import Client from '../models/clientModel.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({})
      .populate('history.quotes')
      .populate('history.receptions')
      .populate('history.purchases');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Private
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('history.quotes')
      .populate('history.receptions')
      .populate('history.purchases');
    
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const clientExists = await Client.findOne({ email });

    if (clientExists) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      history: {
        quotes: [],
        receptions: [],
        purchases: []
      }
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const client = await Client.findById(req.params.id);

    if (client) {
      client.name = name || client.name;
      client.email = email || client.email;
      client.phone = phone || client.phone;

      const updatedClient = await client.save();
      res.json(updatedClient);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (client) {
      await client.deleteOne();
      res.json({ message: 'Client removed' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client history
// @route   GET /api/clients/:id/history
// @access  Private
export const getClientHistory = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('history.quotes')
      .populate('history.receptions')
      .populate('history.purchases');

    if (client) {
      res.json(client.history);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};