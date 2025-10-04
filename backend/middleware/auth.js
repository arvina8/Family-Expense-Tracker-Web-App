const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.requireGroupMember = (getGroupIdFromReq) => async (req, res, next) => {
  const groupId = typeof getGroupIdFromReq === 'function' ? getGroupIdFromReq(req) : req.params.groupId || req.body.group || req.query.groupId;
  if (!groupId) return res.status(400).json({ error: 'groupId is required' });
  const isMember = req.user.memberships?.some(m => String(m.group?._id || m.group) === String(groupId));
  if (!isMember) return res.status(403).json({ error: 'Forbidden: not a group member' });
  req.groupId = groupId;
  next();
};

exports.requireGroupAdmin = (getGroupIdFromReq) => async (req, res, next) => {
  const groupId = typeof getGroupIdFromReq === 'function' ? getGroupIdFromReq(req) : req.params.groupId || req.body.group || req.query.groupId;
  if (!groupId) return res.status(400).json({ error: 'groupId is required' });
  const isAdmin = req.user.memberships?.some(m => String(m.group?._id || m.group) === String(groupId) && m.role === 'admin');
  if (!isAdmin) return res.status(403).json({ error: 'Admin privileges required' });
  req.groupId = groupId;
  next();
};
