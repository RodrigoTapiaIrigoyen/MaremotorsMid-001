import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Product from '../models/productModel.js';
import Quote from '../models/quoteModel.js';
import Reception from '../models/receptionModel.js';
import Sale from '../models/saleModel.js';

const router = express.Router();

// @desc    Generate inventory report
// @route   GET /api/reports/inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const products = await Product.find({})
      .select('name category price stock minStock partNumber')
      .sort('category');

    const report = {
      totalProducts: products.length,
      totalValue: products.reduce((acc, product) => acc + (product.price * product.stock), 0),
      lowStock: products.filter(product => product.stock <= product.minStock),
      products: products
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate quotes report
// @route   GET /api/reports/quotes
// @access  Private
router.get('/quotes', protect, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      query.status = status;
    }

    const quotes = await Quote.find(query)
      .populate('client', 'name email')
      .populate('createdBy', 'name')
      .sort('-createdAt');

    const report = {
      totalQuotes: quotes.length,
      totalValue: quotes.reduce((acc, quote) => acc + quote.total, 0),
      statusSummary: {
        pending: quotes.filter(q => q.status === 'pending').length,
        approved: quotes.filter(q => q.status === 'approved').length,
        archived: quotes.filter(q => q.status === 'archived').length
      },
      quotes: quotes
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate receptions report
// @route   GET /api/reports/receptions
// @access  Private
router.get('/receptions', protect, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      query.status = status;
    }

    const receptions = await Reception.find(query)
      .populate('client', 'name email')
      .populate('assignedMechanic')
      .sort('-createdAt');

    const report = {
      totalReceptions: receptions.length,
      statusSummary: {
        pending: receptions.filter(r => r.status === 'pending').length,
        inProgress: receptions.filter(r => r.status === 'in-progress').length,
        completed: receptions.filter(r => r.status === 'completed').length
      },
      receptions: receptions
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private
router.get('/sales', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query)
      .populate('client', 'name email')
      .populate('createdBy', 'name')
      .populate('items.item')
      .sort('-createdAt');

    const report = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
      averageSale: sales.length > 0 ? 
        sales.reduce((acc, sale) => acc + sale.total, 0) / sales.length : 0,
      paymentMethods: sales.reduce((acc, sale) => {
        acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
        return acc;
      }, {}),
      sales: sales
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;