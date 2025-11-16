// backend/src/routes/auth.routes.js
const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../controllers/auth.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

// Validators
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['admin', 'client', 'staff']).withMessage('Invalid role')
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public
router.post('/register', registerRules, auth.register);
router.post('/login', loginRules, auth.login);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);

// Example protected routes
router.get('/me', requireAuth, auth.me);

// Example role-protected (admin only) demo
router.get('/admin-only', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
});

module.exports = router;
