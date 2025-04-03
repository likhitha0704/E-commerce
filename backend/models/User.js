
// models/User.js
const mongoose = require('mongoose'); // ✅ Import mongoose
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  email: { type: String },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
