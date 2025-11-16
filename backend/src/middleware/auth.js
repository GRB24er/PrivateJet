// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

function parseAuthHeader(req) {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || typeof h !== 'string') return null;
  const [scheme, token] = h.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token.trim();
}

exports.requireAuth = (req, res, next) => {
  try {
    const token = parseAuthHeader(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // expected payload fields: sub (userId), role, email, name
    if (!payload?.sub) return res.status(401).json({ message: 'Unauthorized' });

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  return next();
};
