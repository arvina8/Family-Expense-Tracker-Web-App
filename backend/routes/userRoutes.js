const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  initializeDefaultUsers 
} = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getUsers);
router.post('/initialize', initializeDefaultUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
