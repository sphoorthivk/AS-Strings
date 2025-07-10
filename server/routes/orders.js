import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Check stock
      const stock = product.stock.get(item.size) || 0;
      if (stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name} in size ${item.size}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        size: item.size,
        quantity: item.quantity,
        price: product.price
      });

      // Update stock
      product.stock.set(item.size, stock - item.quantity);
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await order.save();
    await order.populate('items.product user');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber },
      { new: true }
    ).populate('user items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;