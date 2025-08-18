const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, default: '' },
  split: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    ratio: { type: Number, required: true, min: 0, max: 1 }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to ensure split ratios sum to 1
expenseSchema.pre('save', function(next) {
  if (this.split && this.split.length > 0) {
    const totalRatio = this.split.reduce((sum, s) => sum + s.ratio, 0);
    if (Math.abs(totalRatio - 1) > 0.001) {
      return next(new Error('Split ratios must sum to 1.0'));
    }
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
