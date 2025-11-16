// backend/src/routes/jet.routes.js
const router = require('express').Router();
const { body } = require('express-validator');
const jets = require('../controllers/jet.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public
router.get('/', jets.list);

// Admin-only (put BEFORE '/:id' so it isn't captured by the param route)
router.get('/admin/all', requireAuth, requireRole('admin'), jets.adminList);

// Public detail (keep after admin route)
router.get('/:id', jets.getOne);

const createRules = [
  body('name').trim().notEmpty(),
  body('category').isIn(['Light','Midsize','Heavy','UltraLong']),
  body('seats').isInt({ min: 1 }),
  body('rangeNM').isInt({ min: 1 }),
  body('speedKts').isInt({ min: 1 }),
  body('hourlyRate').isFloat({ min: 0 })
];

router.post('/', requireAuth, requireRole('admin'), createRules, jets.create);
router.put('/:id', requireAuth, requireRole('admin'), createRules, jets.update);
router.delete('/:id', requireAuth, requireRole('admin'), jets.remove);

module.exports = router;
