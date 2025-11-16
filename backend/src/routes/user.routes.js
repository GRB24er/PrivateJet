const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/user.controller');

router.get('/me', requireAuth, ctrl.getMe);
router.put('/me', requireAuth, ctrl.updateMe);
router.put('/me/password', requireAuth, ctrl.changePassword);

module.exports = router;
