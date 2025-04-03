const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middlewares/authMiddleware'); // Ensure this file exists
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

// Admin Dashboard Metrics Route
router.get('/metrics', verifyAdmin, async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const orderCount = await Order.countDocuments();
    const inventoryCount = await Product.countDocuments();
    const couponCount = await Coupon.countDocuments();

    res.json({
      sales: totalSales[0]?.total || 0,
      orders: orderCount,
      inventory: inventoryCount,
      coupons: couponCount
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router; // ✅ Correct export
