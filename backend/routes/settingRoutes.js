import express from 'express';
import {
  getSettings,
  updateSettings,
  getCompanySettings,
  updateCompanySettings
} from '../controllers/settingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSettings)
  .put(protect, admin, updateSettings);

router.route('/company')
  .get(protect, getCompanySettings)
  .put(protect, admin, updateCompanySettings);

export default router;