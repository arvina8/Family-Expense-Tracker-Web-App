const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratio: { type: Number, required: true, min: 0 }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, default: '' },
  split: { type: [splitSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Ensure split ratios sum to 1 when provided
expenseSchema.pre('save', function(next) {
  if (this.split && this.split.length > 0) {
    const totalRatio = this.split.reduce((sum, s) => sum + s.ratio, 0);
    if (totalRatio <= 0) return next(new Error('Split ratios must sum to > 0'));
    const normalized = Math.abs(totalRatio - 1) <= 0.001;
    if (!normalized) return next(new Error('Split ratios must sum to 1.0'));
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
