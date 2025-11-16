const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Booking = require('../models/Booking');
const Jet = require('../models/Jet');
const mongoose = require('mongoose');

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// GET /api/bookings/check
exports.check = asyncHandler(async (req, res) => {
  const { jetId, from, to } = req.query;
  if (!jetId || !from || !to) return res.status(400).json({ message: 'jetId, from, to required' });

  const start = new Date(from);
  const end = new Date(to);
  if (!(start < end)) return res.status(400).json({ message: 'Invalid time range: arrival must be after departure.' });

  const conflicts = await Booking.find({
    jet: jetId,
    status: { $in: ['Pending', 'Confirmed'] },
    $or: [{ departureAt: { $lt: end }, arrivalAt: { $gt: start } }]
  }).select('_id departureAt arrivalAt status');

  res.json({ available: conflicts.length === 0, conflicts });
});

// POST /api/bookings
exports.create = asyncHandler(async (req, res) => {
  if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

  const { jet, origin, destination, departureAt, arrivalAt } = req.body;
  const start = new Date(departureAt);
  const end = new Date(arrivalAt);
  if (!(start < end)) return res.status(400).json({ message: 'Invalid time range: arrival must be after departure.' });

  const j = await Jet.findById(jet);
  if (!j || !j.isActive) return res.status(404).json({ message: 'Jet not found' });

  const conflict = await Booking.exists({
    jet,
    status: { $in: ['Pending', 'Confirmed'] },
    $or: [{ departureAt: { $lt: end }, arrivalAt: { $gt: start } }]
  });
  if (conflict) return res.status(409).json({ message: 'Jet not available for selected time' });

  const hours = Math.max(1, (end - start) / (1000 * 60 * 60));
  const price = Math.round(hours * j.hourlyRate);

  const booking = await Booking.create({
    client: req.user.id,
    jet,
    origin,
    destination,
    departureAt: start,
    arrivalAt: end,
    flightHours: Number(hours.toFixed(2)),
    priceUSD: price,
    status: 'Pending',
    statusHistory: [{ status: 'Pending', at: new Date(), by: req.user.id }]
  });

  res.status(201).json({ booking });
});

// GET /api/bookings/me
exports.myBookings = asyncHandler(async (req, res) => {
  if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
  const items = await Booking.find({ client: req.user.id })
    .populate('jet', 'name category hourlyRate')
    .sort({ createdAt: -1 });
  res.json({ items });
});

// NEW: GET /api/bookings/:id (client can see own)
exports.getOneMine = asyncHandler(async (req, res) => {
  if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

  const bk = await Booking.findOne({ _id: id, client: req.user.id })
    .populate('jet', 'name category hourlyRate baseAirport')
    .populate('statusHistory.by', 'name email role');

  if (!bk) return res.status(404).json({ message: 'Booking not found' });
  res.json({ booking: bk });
});

// ADMIN — list all
exports.adminList = asyncHandler(async (req, res) => {
  const items = await Booking.find({})
    .populate('jet', 'name category')
    .populate('client', 'name email')
    .sort({ createdAt: -1 });
  res.json({ items });
});

// ADMIN — update (status/notes/times); record status history on change
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const allowed = ['status', 'notes', 'departureAt', 'arrivalAt'];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

  let start, end;
  if (patch.departureAt && patch.arrivalAt) {
    start = new Date(patch.departureAt);
    end = new Date(patch.arrivalAt);
    if (!(start < end)) return res.status(400).json({ message: 'Invalid time range: arrival must be after departure.' });
  }

  const bk = await Booking.findById(id);
  if (!bk) return res.status(404).json({ message: 'Booking not found' });

  if (start && end) {
    const conflict = await Booking.exists({
      _id: { $ne: id },
      jet: bk.jet,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [{ departureAt: { $lt: end }, arrivalAt: { $gt: start } }]
    });
    if (conflict) return res.status(409).json({ message: 'New time conflicts with another booking' });

    const hours = Math.max(1, (end - start) / (1000 * 60 * 60));
    patch.flightHours = Number(hours.toFixed(2));
    const jetDoc = await Jet.findById(bk.jet);
    patch.priceUSD = Math.round(hours * (jetDoc?.hourlyRate || 0));
  }

  const prevStatus = bk.status;
  Object.assign(bk, patch);

  // push status history if changed
  if (patch.status && patch.status !== prevStatus) {
    bk.statusHistory.push({ status: patch.status, at: new Date(), by: req.user?.id });
  }

  await bk.save();
  res.json({ booking: bk });
});

// CLIENT — cancel own booking
exports.cancelMine = asyncHandler(async (req, res) => {
  if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const bk = await Booking.findOne({ _id: id, client: req.user.id });
  if (!bk) return res.status(404).json({ message: 'Booking not found' });
  if (['Completed', 'Cancelled'].includes(bk.status)) {
    return res.status(400).json({ message: `Already ${bk.status}` });
  }
  bk.status = 'Cancelled';
  bk.statusHistory.push({ status: 'Cancelled', at: new Date(), by: req.user.id });
  await bk.save();
  res.json({ booking: bk });
});
