const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Category = require('../models/Category');

const ensureGroupAccess = async (user, groupId) => {
  if (!groupId) {
    return { error: { status: 400, message: 'groupId is required' } };
  }

  const group = await Group.findById(groupId).populate('members.user', 'name email');
  if (!group) {
    return { error: { status: 404, message: 'Group not found' } };
  }

  const isMember = group.members.some(m => String(m.user?._id || m.user) === String(user._id));
  if (!isMember) {
    return { error: { status: 403, message: 'Forbidden: not a group member' } };
  }

  return { group };
};

const normaliseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validateSplit = (split = [], group) => {
  if (!Array.isArray(split)) {
    throw new Error('split must be an array');
  }

  const memberIds = new Set(group.members.map(m => String(m.user?._id || m.user)));

  split.forEach(entry => {
    if (!entry || !entry.user) {
      throw new Error('split entries must include user');
    }
    if (typeof entry.ratio !== 'number' || entry.ratio < 0) {
      throw new Error('split ratios must be non-negative numbers');
    }
    if (!memberIds.has(String(entry.user))) {
      throw new Error('split users must belong to the group');
    }
  });

  if (split.length) {
    const total = split.reduce((sum, entry) => sum + entry.ratio, 0);
    if (Math.abs(total - 1) > 0.001) {
      throw new Error('split ratios must add up to 1');
    }
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { group, amount, category, date, paidBy, notes = '', split = [] } = req.body;

    if (amount == null || Number(amount) < 0) {
      return res.status(400).json({ error: 'amount is required and must be non-negative' });
    }
    if (!category) {
      return res.status(400).json({ error: 'category is required' });
    }
    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }
    if (!paidBy) {
      return res.status(400).json({ error: 'paidBy is required' });
    }

    const { error, group: groupDoc } = await ensureGroupAccess(req.user, group);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    const normalizedDate = normaliseDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ error: 'date must be a valid date' });
    }

    const categoryDoc = await Category.findOne({ _id: category, group });
    if (!categoryDoc) {
      return res.status(404).json({ error: 'Category not found in this group' });
    }

    const paidMember = groupDoc.members.find(m => String(m.user._id) === String(paidBy));
    if (!paidMember) {
      return res.status(400).json({ error: 'paidBy must belong to the group' });
    }

    validateSplit(split, groupDoc);

    const expense = await Expense.create({
      group,
      amount,
      category,
      date: normalizedDate,
      paidBy,
      notes,
      split
    });

    await expense.populate('category paidBy split.user');
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { groupId } = req.query;
    const { error, group } = await ensureGroupAccess(req.user, groupId);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    const expenses = await Expense.find({ group: group._id })
      .sort({ date: -1 })
      .populate('category paidBy split.user');
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
    const { error } = await ensureGroupAccess(req.user, expense.group);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const { error, group } = await ensureGroupAccess(req.user, expense.group);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    if (req.body.amount != null) {
      if (Number(req.body.amount) < 0) {
        return res.status(400).json({ error: 'amount must be non-negative' });
      }
      expense.amount = req.body.amount;
    }

    if (req.body.category) {
      const categoryDoc = await Category.findOne({ _id: req.body.category, group: expense.group });
      if (!categoryDoc) {
        return res.status(404).json({ error: 'Category not found in this group' });
      }
      expense.category = categoryDoc._id;
    }

    if (req.body.date) {
      const normalizedDate = normaliseDate(req.body.date);
      if (!normalizedDate) {
        return res.status(400).json({ error: 'date must be valid' });
      }
      expense.date = normalizedDate;
    }

    if (req.body.paidBy) {
      const paidMember = group.members.find(m => String(m.user._id) === String(req.body.paidBy));
      if (!paidMember) {
        return res.status(400).json({ error: 'paidBy must belong to the group' });
      }
      expense.paidBy = req.body.paidBy;
    }

    if (req.body.notes !== undefined) {
      expense.notes = req.body.notes;
    }

    if (req.body.split !== undefined) {
      validateSplit(req.body.split, group);
      expense.split = req.body.split;
    }

    await expense.save();
    await expense.populate('category paidBy split.user');
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const { error } = await ensureGroupAccess(req.user, expense.group);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateSplitBalance = async (req, res) => {
  try {
    const { groupId } = req.query;
    const { error, group } = await ensureGroupAccess(req.user, groupId);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    const expenses = await Expense.find({ group: groupId }).populate('paidBy split.user');
    const balances = {};

    group.members.forEach(m => {
      balances[m.user._id] = { name: m.user.name, paid: 0, owes: 0, balance: 0 };
    });

    expenses.forEach(expense => {
      const totalAmount = expense.amount;
      const splitCount = expense.split.length || group.members.length || 1;

      const payerId = expense.paidBy?._id ? String(expense.paidBy._id) : 'unassigned';
      const payerName = expense.paidBy?.name || 'Unassigned';

      if (!balances[payerId]) {
        balances[payerId] = {
          name: payerName,
          paid: 0,
          owes: 0,
          balance: 0
        };
      }
      balances[payerId].paid += totalAmount;

      if (expense.split.length > 0) {
        expense.split.forEach(splitEntry => {
          const splitUserId = splitEntry.user?._id ? String(splitEntry.user._id) : String(splitEntry.user || 'unassigned');
          const splitUserName = splitEntry.user?.name || 'Unassigned';
          if (!balances[splitUserId]) {
            balances[splitUserId] = {
              name: splitUserName,
              paid: 0,
              owes: 0,
              balance: 0
            };
          }
          balances[splitUserId].owes += totalAmount * splitEntry.ratio;
        });
      } else {
        const sharePerPerson = totalAmount / splitCount;
        group.members.forEach(member => {
          balances[member.user._id].owes += sharePerPerson;
        });
      }
    });

    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].paid - balances[userId].owes;
    });

    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
