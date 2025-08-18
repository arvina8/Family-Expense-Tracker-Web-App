const express = require('express');
const router = express.Router();
const { 
  createExpense, 
  getExpenses, 
  getExpenseById, 
  updateExpense, 
  deleteExpense,
  calculateSplitBalance 
} = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/balances', calculateSplitBalance);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
