
// Coupon Routes
// Models
// const User = require('./models/User');
// const Product = require('./models/Product');
// const Cart = require('./models/Cart');
// const Order = require('./models/Order');
// const Coupon = require('./models/Coupon');

// routes/coupons.js
const express = require('express');
const Coupon = require('../models/Coupon');
const router = express.Router();

// Create a new coupon
router.post('/create', async (req, res) => {
  try {
    const { code, discount, minCartValue, expiryDate } = req.body;
    const newCoupon = new Coupon({ code, discount, minCartValue, expiryDate });
    await newCoupon.save();
    res.json({ message: 'Coupon created', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error });
  }
});

// Validate and apply coupon
router.post('/apply', async (req, res) => {
  try {
    const { code, cartValue } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(400).json({ message: 'Invalid coupon' });
    if (cartValue < coupon.minCartValue) return res.status(400).json({ message: 'Minimum cart value not met' });
    if (new Date() > new Date(coupon.expiryDate)) return res.status(400).json({ message: 'Coupon expired' });
    res.json({ message: 'Coupon applied', discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ message: 'Error applying coupon', error });
  }
});