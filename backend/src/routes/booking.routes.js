// backend/src/routes/booking.routes.js
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/booking.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

// Availability check (public)
router.get('/check', ctrl.check);

// Create booking (client only)
router.post(
  '/',
  requireAuth,
  [
    body('jet').isMongoId().withMessage('jet must be a valid id'),
    body('origin').trim().notEmpty().withMessage('origin is required'),
    body('destination').trim().notEmpty().withMessage('destination is required'),
    body('departureAt').isISO8601().toDate().withMessage('departureAt must be ISO8601'),
    body('arrivalAt').isISO8601().toDate().withMessage('arrivalAt must be ISO8601')
  ],
  ctrl.create
);

// My bookings
router.get('/me', requireAuth, ctrl.myBookings);

// Client cancel
router.post('/:id/cancel', requireAuth, ctrl.cancelMine);

// Admin
router.get('/admin/all', requireAuth, requireRole('admin'), ctrl.adminList);
router.put('/admin/:id', requireAuth, requireRole('admin'), ctrl.update);

module.exports = router;
