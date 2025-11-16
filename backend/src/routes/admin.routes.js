// backend/src/routes/admin.routes.js
const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

router.get('/stats', requireAuth, requireRole('admin'), ctrl.stats);

module.exports = router;
