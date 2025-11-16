const asyncHandler = require('../utils/asyncHandler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getMe = asyncHandler(async (req, res) => {
  const u = await User.findById(req.user.id).select('_id name email role phone createdAt');
  res.json({ user: u });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { ...(name ? { name } : {}), ...(phone ? { phone } : {}) },
    { new: true }
  ).select('_id name email role phone createdAt');
  res.json({ user: updated });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword and newPassword required' });

  const u = await User.findById(req.user.id).select('+password');
  if (!u) return res.status(404).json({ message: 'User not found' });

  const ok = await bcrypt.compare(currentPassword, u.password);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });

  u.password = await bcrypt.hash(newPassword, 10);
  await u.save();

  res.json({ message: 'Password updated' });
});
