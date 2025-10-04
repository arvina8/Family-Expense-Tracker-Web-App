const Expense = require('../models/Expense');
const Group = require('../models/Group');

exports.createExpense = async (req, res) => {
  try {
    const { group, amount, category, date, paidBy, notes, split } = req.body;
    if (!group) return res.status(400).json({ error: 'group is required' });
    // Basic membership check could be in middleware; keep minimal validation here
    const expense = new Expense({ group, amount, category, date, paidBy, notes, split });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { groupId } = req.query;
    const query = groupId ? { group: groupId } : {};
    const expenses = await Expense.find(query).populate('category paidBy split.user');
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
    const { amount, category, date, paidBy, notes, split } = req.body;
    const update = { amount, category, date, paidBy, notes, split };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    const expense = await Expense.findByIdAndUpdate(req.params.id, update, {
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
    const { groupId } = req.query;
    if (!groupId) return res.status(400).json({ error: 'groupId is required' });
    const group = await Group.findById(groupId).populate('members.user');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const expenses = await Expense.find({ group: groupId }).populate('paidBy split.user');
    const balances = {};
    
    // Initialize balances for group members
    group.members.forEach(m => {
      balances[m.user._id] = { name: m.user.name, paid: 0, owes: 0, balance: 0 };
    });

    expenses.forEach(expense => {
      const totalAmount = expense.amount;
      const splitCount = expense.split.length || group.members.length;
      
      // Person who paid gets credit
      balances[expense.paidBy._id].paid += totalAmount;
      
      // Calculate what each person owes
      if (expense.split.length > 0) {
        // Custom split ratios
        expense.split.forEach(split => {
          const owedAmount = totalAmount * split.ratio;
          balances[split.user._id].owes += owedAmount;
        });
      } else {
        // Even split among group members
        const sharePerPerson = totalAmount / splitCount;
        group.members.forEach(m => {
          balances[m.user._id].owes += sharePerPerson;
        });
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
