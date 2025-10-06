const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const inviteRefSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','revoked','expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { _id: false });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, index: true },
  members: { type: [groupMemberSchema], default: [] },
  invites: { type: [inviteRefSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

groupSchema.pre('validate', function(next){
  if(!this.code){
    this.code = Math.random().toString(36).substring(2,8).toUpperCase();
  }
  next();
});

groupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Group', groupSchema);
