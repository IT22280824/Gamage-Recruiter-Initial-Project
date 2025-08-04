const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: true },
  password: String,
  role: { 
    type: String, 
    default: 'user' },
  isVerified: { 
    type: Boolean, 
    default: false },
  isActive: { 
    type: Boolean, 
    default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
