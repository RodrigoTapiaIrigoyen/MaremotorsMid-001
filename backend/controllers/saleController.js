import Sale from '../models/saleModel.js';
import Client from '../models/clientModel.js';
import Product from '../models/productModel.js';

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('client', 'name email')
      .populate('quote')
      .populate('createdBy', 'name')
      .populate('items.item');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('client', 'name email')
      .populate('quote')
      .populate('createdBy', 'name')
      .populate('items.item');
    
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
export const createSale = async (req, res) => {
  try {
    const { client, quote, items, paymentMethod } = req.body;

    // Calculate total
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Update product stock
    for (const item of items) {
      if (item.type === 'product') {
        const product = await Product.findById(item.item);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({ 
              message: `Insufficient stock for product: ${product.name}` 
            });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const sale = await Sale.create({
      client,
      quote,
      items,
      total,
      paymentMethod,
      createdBy: req.user._id
    });

    // Add sale to client's history
    await Client.findByIdAndUpdate(client, {
      $push: { 'history.purchases': sale._id }
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private/Admin
export const updateSale = async (req, res) => {
  try {
    const { status } = req.body;
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      sale.status = status || sale.status;
      const updatedSale = await sale.save();
      res.json(updatedSale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private/Admin
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      // Restore product stock
      for (const item of sale.items) {
        if (item.type === 'product') {
          const product = await Product.findById(item.item);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
      }

      // Remove sale from client's history
      await Client.findByIdAndUpdate(sale.client, {
        $pull: { 'history.purchases': sale._id }
      });

      await sale.deleteOne();
      res.json({ message: 'Sale removed' });
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
export const getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const stats = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageSale: { $avg: '$total' }
        }
      }
    ]);

    const dailySales = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      summary: stats[0] || {
        totalSales: 0,
        totalRevenue: 0,
        averageSale: 0
      },
      dailySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};