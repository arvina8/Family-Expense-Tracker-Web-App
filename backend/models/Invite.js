const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  token: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['admin','member'], default: 'member' },
  status: { type: String, enum: ['pending','accepted','revoked','expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

inviteSchema.index({ group:1, email:1, status:1 });

module.exports = mongoose.model('Invite', inviteSchema);
