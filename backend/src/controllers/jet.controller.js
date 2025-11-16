// backend/src/controllers/jet.controller.js
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Jet = require('../models/Jet');

exports.create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const jet = await Jet.create(req.body);
  res.status(201).json({ jet });
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const jet = await Jet.findByIdAndUpdate(id, req.body, { new: true });
  if (!jet) return res.status(404).json({ message: 'Jet not found' });
  res.json({ jet });
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const jet = await Jet.findByIdAndDelete(id);
  if (!jet) return res.status(404).json({ message: 'Jet not found' });
  res.json({ message: 'Deleted' });
});

exports.getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const jet = await Jet.findById(id);
  if (!jet) return res.status(404).json({ message: 'Jet not found' });
  res.json({ jet });
});

// Public list with filters + pagination
exports.list = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    seatsMin,
    seatsMax,
    rateMin,
    rateMax,
    onlyAvailable,
    page = 1,
    limit = 12
  } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (onlyAvailable === 'true') filter.isAvailable = true;

  if (seatsMin || seatsMax) {
    filter.seats = {};
    if (seatsMin) filter.seats.$gte = Number(seatsMin);
    if (seatsMax) filter.seats.$lte = Number(seatsMax);
  }

  if (rateMin || rateMax) {
    filter.hourlyRate = {};
    if (rateMin) filter.hourlyRate.$gte = Number(rateMin);
    if (rateMax) filter.hourlyRate.$lte = Number(rateMax);
  }

  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { manufacturer: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { baseAirport: new RegExp(q, 'i') }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Jet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Jet.countDocuments(filter)
  ]);

  res.json({
    items,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  });
});

// Admin list (includes inactive)
exports.adminList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Jet.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Jet.countDocuments({})
  ]);
  res.json({ items, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
});
