// backend/src/controllers/admin.controller.js
const asyncHandler = require('../utils/asyncHandler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Jet = require('../models/Jet');

exports.stats = asyncHandler(async (req, res) => {
  // Totals
  const [users, jets, bookings] = await Promise.all([
    User.countDocuments({}),
    Jet.countDocuments({ isActive: true }),
    Booking.countDocuments({}),
  ]);

  // Bookings by status
  const byStatusAgg = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const byStatus = ['Pending','Confirmed','Completed','Cancelled']
    .reduce((acc, k) => ({ ...acc, [k]: byStatusAgg.find(x=>x._id===k)?.count || 0 }), {});

  // Revenue (sum priceUSD) for Completed this month / total
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [revTotalAgg, revMonthAgg] = await Promise.all([
    Booking.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, revenue: { $sum: '$priceUSD' } } }
    ]),
    Booking.aggregate([
      { $match: { status: 'Completed', arrivalAt: { $gte: monthStart } } },
      { $group: { _id: null, revenue: { $sum: '$priceUSD' } } }
    ]),
  ]);
  const revenueTotal = revTotalAgg[0]?.revenue || 0;
  const revenueMonth = revMonthAgg[0]?.revenue || 0;

  // Top jets by hours (Completed)
  const topJetsAgg = await Booking.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: '$jet', hours: { $sum: '$flightHours' }, revenue: { $sum: '$priceUSD' } } },
    { $sort: { hours: -1 } },
    { $limit: 5 }
  ]);
  // Attach jet names
  const jetIds = topJetsAgg.map(j => j._id).filter(Boolean);
  const jetDocs = await Jet.find({ _id: { $in: jetIds } }).select('_id name category');
  const topJets = topJetsAgg.map(r => {
    const j = jetDocs.find(d => String(d._id) === String(r._id));
    return { jetId: r._id, name: j?.name || 'Unknown', category: j?.category || '-', hours: Number(r.hours.toFixed(2)), revenue: r.revenue };
  });

  // Bookings per last 12 months
  const last12Start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  const monthlyAgg = await Booking.aggregate([
    { $match: { createdAt: { $gte: last12Start } } },
    {
      $group: {
        _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } }
  ]);
  const monthly = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (11 - i), 1));
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1;
    const hit = monthlyAgg.find(x => x._id.y === y && x._id.m === m);
    monthly.push({ y, m, count: hit?.count || 0 });
  }

  res.json({
    totals: { users, jets, bookings, revenueTotal, revenueMonth },
    byStatus,
    topJets,
    monthly
  });
});
