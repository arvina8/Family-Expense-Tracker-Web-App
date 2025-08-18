const Expense = require('../models/Expense');

exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('category paidBy split.user');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('category paidBy split.user');
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category paidBy split.user');
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateSplitBalance = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy split.user');
    const balances = {};
    
    expenses.forEach(expense => {
      const totalAmount = expense.amount;
      const splitCount = expense.split.length || 1;
      
      // Initialize balances for all users involved
      if (!balances[expense.paidBy._id]) {
        balances[expense.paidBy._id] = { 
          name: expense.paidBy.name, 
          paid: 0, 
          owes: 0, 
          balance: 0 
        };
      }
      
      // Person who paid gets credit
      balances[expense.paidBy._id].paid += totalAmount;
      
      // Calculate what each person owes
      if (expense.split.length > 0) {
        // Custom split ratios
        expense.split.forEach(split => {
          if (!balances[split.user._id]) {
            balances[split.user._id] = { 
              name: split.user.name, 
              paid: 0, 
              owes: 0, 
              balance: 0 
            };
          }
          const owedAmount = totalAmount * split.ratio;
          balances[split.user._id].owes += owedAmount;
        });
      } else {
        // Even split among all family members (you might want to get family members list)
        const sharePerPerson = totalAmount / splitCount;
        balances[expense.paidBy._id].owes += sharePerPerson;
      }
    });
    
    // Calculate final balances
    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].paid - balances[userId].owes;
    });
    
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
