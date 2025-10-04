const express = require('express');
const router = express.Router();
const { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { auth, requireGroupMember } = require('../middleware/auth');

router.use(auth);

router.post('/', requireGroupMember(), createCategory);
router.get('/', requireGroupMember(), getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
