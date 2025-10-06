const Group = require('../models/Group');
const User = require('../models/User');
const Category = require('../models/Category');
const Invite = require('../models/Invite');
const Expense = require('../models/Expense');
const crypto = require('crypto');

const DEFAULT_CATEGORIES = ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other"];
const VALID_ROLES = ['admin', 'member'];
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const loadGroupWithMembers = (groupId) =>
  Group.findById(groupId).populate('members.user', 'name email');

const isGroupMember = (group, userId) =>
  group.members.some(member => String(member.user?._id || member.user) === String(userId));

const isGroupAdmin = (group, userId) =>
  group.members.some(member => String(member.user?._id || member.user) === String(userId) && member.role === 'admin');

const ensureValidRole = (role) => {
  if (!VALID_ROLES.includes(role)) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required', code: 'GROUP_NAME_REQUIRED' });
    }

    const group = await Group.create({
      name: name.trim(),
      creator: req.user._id,
      members: [{ user: req.user._id, role: 'admin', joinedAt: new Date() }]
    });

    // Add membership to user
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { memberships: { group: group._id, role: 'admin' } } });

    // Seed default categories
    await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name, group: group._id })));

    await group.populate('members.user', 'name email');
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'GROUP_CREATE_FAILED' });
  }
};

exports.myGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'memberships.group',
      populate: { path: 'members.user', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }

    const memberships = (user.memberships || []).map(m => ({
      group: m.group,
      role: m.role
    }));

    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message, code: 'GROUP_LIST_FAILED' });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await loadGroupWithMembers(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    }
    if (!isGroupMember(group, req.user._id)) {
      return res.status(403).json({ message: 'Forbidden', code: 'NOT_GROUP_MEMBER' });
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message, code: 'GROUP_FETCH_FAILED' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const groupId = req.params.groupId;
    if (!email) {
      return res.status(400).json({ message: 'Email is required', code: 'EMAIL_REQUIRED' });
    }

    ensureValidRole(role);

    const group = await loadGroupWithMembers(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    }

    const lower = email.toLowerCase().trim();
    const user = await User.findOne({ email: lower });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Ask them to register first.', code: 'USER_NOT_FOUND' });
    }

    if (isGroupMember(group, user._id)) {
      return res.status(409).json({ message: 'Already a member', code: 'ALREADY_MEMBER' });
    }

    group.members.push({ user: user._id, role, joinedAt: new Date() });
    await group.save();

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { memberships: { group: group._id, role } }
    });

    await group.populate('members.user', 'name email');
    res.json({ message: 'Member added', group });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'ADD_MEMBER_FAILED' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.groupId;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required', code: 'USER_ID_REQUIRED' });
    }

    const group = await loadGroupWithMembers(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    }

    const membership = group.members.find(m => String(m.user?._id || m.user) === String(userId));
    if (!membership) {
      return res.status(404).json({ message: 'Member not found in group', code: 'MEMBER_NOT_FOUND' });
    }

    if (membership.role === 'admin') {
      const adminCount = group.members.filter(m => m.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove the only admin', code: 'ONLY_ADMIN' });
      }
    }

    group.members = group.members.filter(m => String(m.user?._id || m.user) !== String(userId));
    await group.save();

    await User.findByIdAndUpdate(userId, { $pull: { memberships: { group: groupId } } });

    await group.populate('members.user', 'name email');
    res.json({ message: 'Member removed', group });
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
      group = await loadGroupWithMembers(groupIdOrCode);
    }
    if (!group) {
      group = await Group.findOne({ code: groupIdOrCode.toUpperCase() }).populate('members.user', 'name email');
    }
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    const already = isGroupMember(group, req.user._id);
    if (already) return res.status(409).json({ message: 'Already a member', code: 'ALREADY_MEMBER' });
    group.members.push({ user: req.user._id, role: 'member', joinedAt: new Date() });
    await group.save();
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { memberships: { group: group._id, role: 'member' } } });
    await group.populate('members.user', 'name email');
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
    ensureValidRole(role);

    const group = await loadGroupWithMembers(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });

    const lower = email.toLowerCase().trim();

    // If existing user, add directly
    const existingUser = await User.findOne({ email: lower });
    if (existingUser) {
      const already = isGroupMember(group, existingUser._id);
      if (already) return res.status(409).json({ message: 'Already a member', code: 'ALREADY_MEMBER' });
      group.members.push({ user: existingUser._id, role, joinedAt: new Date() });
      await group.save();
      await User.findByIdAndUpdate(existingUser._id, { $addToSet: { memberships: { group: group._id, role } } });
      await group.populate('members.user', 'name email');
      return res.json({ status: 'added', group });
    }
    // Pending invite
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const existingInvite = group.invites.find(i => i.email === lower && i.status === 'pending');
    if (existingInvite) {
      existingInvite.token = token;
      existingInvite.expiresAt = expiresAt;
      existingInvite.createdAt = new Date();
    } else {
      group.invites.push({ email: lower, token, status: 'pending', createdAt: new Date(), expiresAt });
    }

    await Invite.findOneAndUpdate(
      { group: group._id, email: lower },
      { group: group._id, email: lower, token, role, status: 'pending', expiresAt, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await group.save();
    res.status(201).json({ status: 'invited', token, inviteLink: `${APP_URL}/invite/${token}` });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'INVITE_FAILED' });
  }
};

exports.listInvites = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });

    const now = new Date();
    const invites = group.invites.map(invite => {
      if (invite.status === 'pending' && invite.expiresAt < now) {
        invite.status = 'expired';
      }
      return invite;
    });

    const pending = invites.filter(i => i.status === 'pending');

    if (pending.length !== group.invites.length) {
      group.invites = invites;
      await group.save();
      await Invite.updateMany(
        { group: groupId, expiresAt: { $lt: now }, status: 'pending' },
        { $set: { status: 'expired' } }
      );
    }

    res.json(pending);
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
    if (invite.email && user.email && invite.email !== user.email.toLowerCase()) {
      return res.status(403).json({ message: 'Invite email does not match logged in user', code: 'INVITE_EMAIL_MISMATCH' });
    }
    const group = await loadGroupWithMembers(invite.group);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });
    const already = isGroupMember(group, user._id);
    if (!already) {
      group.members.push({ user: user._id, role: invite.role || 'member', joinedAt: new Date() });
      await group.save();
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { memberships: { group: group._id, role: invite.role || 'member' } }
      });
    }
    invite.status = 'accepted';
    await invite.save();
    // Update embedded status
    group.invites = group.invites.map(i => {
      if (i.token === token) {
        i.status = 'accepted';
      }
      return i;
    });
    await group.save();
    await group.populate('members.user', 'name email');
    res.json({ message: 'Invite accepted', group });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'INVITE_ACCEPT_FAILED' });
  }
};

// Delete group (admin only)
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await loadGroupWithMembers(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });

    if (!isGroupAdmin(group, req.user._id)) {
      return res.status(403).json({ message: 'Only group admins can delete groups', code: 'ADMIN_REQUIRED' });
    }

    const userIds = group.members.map(m => m.user?._id || m.user);
    await User.updateMany(
      { _id: { $in: userIds } },
      { $pull: { memberships: { group: groupId } } }
    );

    await Promise.all([
      Category.deleteMany({ group: groupId }),
      Invite.deleteMany({ group: groupId }),
      Expense.deleteMany({ group: groupId })
    ]);

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
    const group = await loadGroupWithMembers(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found', code: 'GROUP_NOT_FOUND' });

    const membership = group.members.find(m => String(m.user?._id || m.user) === String(req.user._id));
    if (!membership) {
      return res.status(403).json({ message: 'You are not a member of this group', code: 'NOT_MEMBER' });
    }

    const adminCount = group.members.filter(m => m.role === 'admin').length;
    if (membership.role === 'admin' && adminCount === 1) {
      return res.status(400).json({
        message: 'Cannot leave group as the only admin. Transfer admin rights or delete the group.',
        code: 'ONLY_ADMIN'
      });
    }

    group.members = group.members.filter(m => String(m.user?._id || m.user) !== String(req.user._id));
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { memberships: { group: groupId } }
    });

    res.json({ message: 'Left group successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message, code: 'LEAVE_GROUP_FAILED' });
  }
};
