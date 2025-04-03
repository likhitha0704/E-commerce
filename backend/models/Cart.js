// models/Cart.js
const mongoose = require('mongoose'); // ✅ Import mongoose
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
});

module.exports = mongoose.model('Cart', CartSchema);
