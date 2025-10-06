const Group = require('../models/Group');
const User = require('../models/User');
const Category = require('../models/Category');
const Invite = require('../models/Invite');
const crypto = require('crypto');

const DEFAULT_CATEGORIES = ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other"];

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Group name is required', code: 'GROUP_NAME_REQUIRED' });
  const group = await Group.create({ name, creator: req.user._id, members: [{ user: req.user._id, role: 'admin', joinedAt: new Date() }] });

    // Add membership to user
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { memberships: { group: group._id, role: 'admin' } } });

    // Seed default categories
    await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name, group: group._id })));

    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'GROUP_CREATE_FAILED' });
  }
};

exports.myGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('memberships.group');
    res.json(user.memberships.map(m => ({ group: m.group, role: m.role })));
  } catch (err) {
    res.status(500).json({ message: err.message, code: 'GROUP_LIST_FAILED' });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members.user');
  if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    // Ensure requester is a member
    const isMember = group.members.some(m => String(m.user._id) === String(req.user._id));
  if (!isMember) return res.status(403).json({ message: 'Forbidden', code: 'NOT_GROUP_MEMBER' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message, code: 'GROUP_FETCH_FAILED' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const groupId = req.params.groupId;
  if (!email) return res.status(400).json({ message: 'Email is required', code: 'EMAIL_REQUIRED' });
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create a placeholder user? For simplicity, reject and let user self-register
      return res.status(404).json({ message: 'User not found. Ask them to register first.', code: 'USER_NOT_FOUND' });
    }

    // Update group
    const already = group.members.some(m => String(m.user) === String(user._id));
  if (!already) group.members.push({ user: user._id, role, joinedAt: new Date() });
    await group.save();

    // Update user membership
    const membershipAlready = user.memberships.some(m => String(m.group) === String(group._id));
    if (!membershipAlready) {
      user.memberships.push({ group: group._id, role });
      await user.save();
    }

    res.json({ message: 'Member added', group });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'ADD_MEMBER_FAILED' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    group.members = group.members.filter(m => String(m.user) !== String(userId));
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { memberships: { group: groupId } } });

    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'REMOVE_MEMBER_FAILED' });
  }
};

// Join group by id or code
exports.joinGroup = async (req, res) => {
  try {
    const { groupIdOrCode } = req.body;
    if (!groupIdOrCode) return res.status(400).json({ message: 'Group id or code required', code: 'GROUP_ID_OR_CODE_REQUIRED' });
    let group = null;
    if (/^[0-9a-fA-F]{24}$/.test(groupIdOrCode)) {
      group = await Group.findById(groupIdOrCode);
    }
    if (!group) {
      group = await Group.findOne({ code: groupIdOrCode.toUpperCase() });
    }
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    const already = group.members.some(m => String(m.user) === String(req.user._id));
    if (already) return res.status(409).json({ message: 'Already a member', code: 'ALREADY_MEMBER' });
  group.members.push({ user: req.user._id, role: 'member', joinedAt: new Date() });
    await group.save();
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { memberships: { group: group._id, role: 'member' } } });
    res.json({ message: 'Joined group', group });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'GROUP_JOIN_FAILED' });
  }
};

// Invite member (admin)
exports.inviteMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const { groupId } = req.params;
    if (!email) return res.status(400).json({ message: 'Email required', code: 'EMAIL_REQUIRED' });
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    const lower = email.toLowerCase();
    if (group.members.some(m => String(m.user) === String(req.user._id) && !['admin','member'].includes(role))) {
      return res.status(400).json({ message: 'Invalid role', code: 'INVALID_ROLE' });
    }
    // If existing user, add directly
    const existingUser = await User.findOne({ email: lower });
    if (existingUser) {
      const already = group.members.some(m => String(m.user) === String(existingUser._id));
      if (already) return res.status(409).json({ message: 'Already a member', code: 'ALREADY_MEMBER' });
  group.members.push({ user: existingUser._id, role, joinedAt: new Date() });
      await group.save();
      existingUser.memberships.push({ group: group._id, role });
      await existingUser.save();
      return res.json({ status: 'added', group });
    }
    // Pending invite
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const invite = await Invite.create({ group: group._id, email: lower, token, role, expiresAt });
    group.invites.push({ email: lower, token, status: 'pending', createdAt: new Date(), expiresAt });
    await group.save();
    res.status(201).json({ status: 'invited', token, inviteLink: `${process.env.APP_URL || 'http://localhost:3000'}/invite/${token}` });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'INVITE_FAILED' });
  }
};

exports.listInvites = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    res.json(group.invites.filter(i => i.status === 'pending'));
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'INVITES_LIST_FAILED' });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });
    if (!invite) return res.status(404).json({ message: 'Invite not found', code: 'INVITE_NOT_FOUND' });
    if (invite.status !== 'pending') return res.status(409).json({ message: 'Invite already processed', code: 'INVITE_PROCESSED' });
    if (invite.expiresAt < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.status(410).json({ message: 'Invite expired', code: 'INVITE_EXPIRED' });
    }
    // Attach user to group
    const user = await User.findById(req.user._id);
    const group = await Group.findById(invite.group);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    const already = group.members.some(m => String(m.user) === String(user._id));
    if (!already) {
  group.members.push({ user: user._id, role: invite.role || 'member', joinedAt: new Date() });
      await group.save();
      user.memberships.push({ group: group._id, role: invite.role || 'member' });
      await user.save();
    }
    invite.status = 'accepted';
    await invite.save();
    // Update embedded status
    group.invites = group.invites.map(i => i.token === token ? { ...i.toObject(), status: 'accepted' } : i);
    await group.save();
    res.json({ message: 'Invite accepted', groupId: group._id });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'INVITE_ACCEPT_FAILED' });
  }
};

// Delete group (admin only)
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    
    // Check if user is admin
    const userMembership = group.members.find(m => String(m.user) === String(req.user._id));
    if (!userMembership || userMembership.role !== 'admin') {
      return res.status(403).json({ message: 'Only group admins can delete groups', code: 'ADMIN_REQUIRED' });
    }
    
    // Remove group from all users' memberships
    const userIds = group.members.map(m => m.user);
    await User.updateMany(
      { _id: { $in: userIds } },
      { $pull: { memberships: { group: groupId } } }
    );
    
    // Delete related data
    await Category.deleteMany({ group: groupId });
    await Invite.deleteMany({ group: groupId });
    
    // Note: You might want to keep expenses for audit purposes
    // or add a soft delete mechanism instead
    
    // Delete the group
    await Group.findByIdAndDelete(groupId);
    
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'GROUP_DELETE_FAILED' });
  }
};

// Leave group
exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    
    // Check if user is a member
    const userMembership = group.members.find(m => String(m.user) === String(req.user._id));
    if (!userMembership) {
      return res.status(403).json({ message: 'You are not a member of this group', code: 'NOT_MEMBER' });
    }
    
    // Check if user is the only admin
    const admins = group.members.filter(m => m.role === 'admin');
    if (userMembership.role === 'admin' && admins.length === 1) {
      return res.status(400).json({ 
        message: 'Cannot leave group as the only admin. Transfer admin rights or delete the group.', 
        code: 'ONLY_ADMIN' 
      });
    }
    
    // Remove user from group
    group.members = group.members.filter(m => String(m.user) !== String(req.user._id));
    await group.save();
    
    // Remove group from user's memberships
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { memberships: { group: groupId } }
    });
    
    res.json({ message: 'Left group successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'LEAVE_GROUP_FAILED' });
  }
};
