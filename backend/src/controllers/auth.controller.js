// backend/src/controllers/auth.controller.js
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/jwt');

const REFRESH_COOKIE = process.env.REFRESH_TOKEN_COOKIE || 'rtk';

// Helper to send tokens
function sendTokens(res, user) {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // HttpOnly cookie for refresh
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true when using HTTPS in prod
    maxAge: 7 * 24 * 60 * 60 * 1000 // align with REFRESH_TOKEN_TTL
  });

  return accessToken;
}

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role: role || 'client' });

  const accessToken = sendTokens(res, user);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
    accessToken
  });
});

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = sendTokens(res, user);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
    accessToken
  });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
});

exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role, email: user.email, name: user.name });
  res.json({ accessToken });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ message: 'Logged out' });
});
