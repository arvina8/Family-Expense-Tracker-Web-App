const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userProjection = '-password';

const populateMemberships = (query) =>
  query.populate({
    path: 'memberships.group',
    populate: { path: 'members.user', select: 'name email' }
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    const safeUser = await populateMemberships(User.findById(user._id).select(userProjection));
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await populateMemberships(
      User.findOne({ email: email.toLowerCase() }).select('+password')
    );
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = signToken(user._id);
    user.password = undefined;
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await populateMemberships(
      User.findById(req.user._id).select(userProjection)
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
