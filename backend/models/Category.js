const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  createdAt: { type: Date, default: Date.now }
});

categorySchema.index({ group: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
