import express from 'express';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientHistory
} from '../controllers/clientController.js';

const router = express.Router();

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClientById).put(updateClient).delete(deleteClient);
router.route('/:id/history').get(getClientHistory);

export default router;