import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingCost = 0 } = req.body;
    
    console.log('Creating order with data:', { items, shippingAddress, paymentMethod, shippingCost });
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['fullName', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field] || !shippingAddress[field].toString().trim()) {
        return res.status(400).json({ message: `${field} is required in shipping address` });
      }
    }
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      console.log('Processing item:', item);
      
      if (!item.productId || !item.size || !item.quantity) {
        return res.status(400).json({ message: 'Invalid item data: missing productId, size, or quantity' });
      }
      
      const product = await Product.findById(item.productId).populate('media');
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is no longer available` });
      }

      // Check stock
      const stock = product.stock.get(item.size) || 0;
      if (stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name} in size ${item.size}` 
        });
      }

      // Use the price from the item if provided (for consistency), otherwise use product price
      const itemPrice = item.price || product.price;
      const itemTotal = itemPrice * item.quantity;
      
      // Calculate accessories total
      let accessoriesTotal = 0;
      if (item.accessories && Array.isArray(item.accessories)) {
        accessoriesTotal = item.accessories.reduce((sum, acc) => sum + (acc.price || 0), 0) * item.quantity;
      }
      
      totalAmount += itemTotal;
      totalAmount += accessoriesTotal;

      orderItems.push({
        product: product._id,
        size: item.size,
        quantity: item.quantity,
        price: itemPrice,
        accessories: item.accessories || []
      });

      // Update stock
      product.stock.set(item.size, stock - item.quantity);
      await product.save();
      
      console.log(`Updated stock for ${product.name} size ${item.size}: ${stock} -> ${stock - item.quantity}`);
    }
    
    console.log('Total amount calculated:', totalAmount + shippingCost);

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: totalAmount + shippingCost,
      shippingCost,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending'
    });

    await order.save();
    await order.populate([
      { path: 'items.product', populate: { path: 'media' } },
      { path: 'user', select: 'name email' }
    ]);
    
    console.log('Order created successfully:', order._id);

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user._id);
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.product',
        populate: {
          path: 'media'
        }
      })
      .sort({ createdAt: -1 });

    console.log('Found orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
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

// Update payment status (Admin only)
router.put('/:id/payment-status', adminAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
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
    console.log('Fetching order:', req.params.id, 'for user:', req.user._id);
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.product',
        populate: {
          path: 'media'
        }
      })
      .populate('user', 'name email');

    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      console.log('Access denied for order:', req.params.id, 'user:', req.user._id);
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Order found and authorized:', order._id);
    res.json(order);
  } catch (error) {
    console.error('Error fetching single order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;