const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  url: String,
  public_id: String,
  createdAt: { type: Date, default: Date.now },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['private', 'shared', 'public'], default: 'private' }
});

module.exports = mongoose.model('Media', mediaSchema);
