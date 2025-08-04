const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  fileUrl: { 
    type: String, 
    required: true },
  publicId: { 
    type: String }, // for Cloudinary
  title: { 
    type: String },
  description: { 
    type: String },
  tags: [String],
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
  createdAt: { 
    type: Date, 
    default: Date.now }
});

module.exports = mongoose.model("Media", mediaSchema);
