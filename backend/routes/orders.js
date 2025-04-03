// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Place an order
router.post('/place', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId._id);
      if (!product || product.stock < item.quantity) return res.status(400).json({ message: 'Insufficient stock' });
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId: req.user.userId,
      products: cart.products,
      totalAmount,
      status: 'Order Placed',
    });
    await newOrder.save();

    await Cart.findOneAndDelete({ userId: req.user.userId });
    res.json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Admin: Get all orders
router.get('/all', authenticate, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
});

// Admin: Update order status
router.put('/update/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

module.exports = router;
