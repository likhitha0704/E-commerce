
// models/User.js
const mongoose = require('mongoose'); // ✅ Import mongoose
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: false }, // ✅ Make address optional
});


module.exports = mongoose.model('User', UserSchema);
