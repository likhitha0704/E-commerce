



// routes/cart.js
const express = require('express');
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

// Get user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('products.productId');
    if (!cart) return res.json({ products: [], total: 0 });
    
    const total = cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    res.json({ products: cart.products, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

// Add product to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) cart = new Cart({ userId: req.user.userId, products: [] });

    const existingProduct = cart.products.find(p => p.productId.equals(productId));
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
});

// Update product quantity in cart
router.put('/update', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = cart.products.find(p => p.productId.equals(productId));
    if (!product) return res.status(404).json({ message: 'Product not in cart' });

    product.quantity = quantity;
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
});

// Remove product from cart
router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(p => !p.productId.equals(req.params.productId));
    await cart.save();
    res.json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product', error });
  }
});

module.exports = router;
