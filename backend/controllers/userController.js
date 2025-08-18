const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't return passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.initializeDefaultUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ error: 'Users already exist in the system' });
    }

    const defaultUsers = [
      { name: 'Dad', email: 'dad@family.com', password: 'defaultpass123' },
      { name: 'Mom', email: 'mom@family.com', password: 'defaultpass123' },
      { name: 'Child 1', email: 'child1@family.com', password: 'defaultpass123' },
      { name: 'Child 2', email: 'child2@family.com', password: 'defaultpass123' }
    ];

    const createdUsers = await User.insertMany(defaultUsers);
    res.status(201).json({ 
      message: 'Default family members created successfully',
      users: createdUsers.map(user => ({ _id: user._id, name: user.name, email: user.email }))
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
