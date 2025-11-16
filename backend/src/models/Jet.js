// backend/src/models/Jet.js
const mongoose = require('mongoose');

const CATEGORIES = ['Light', 'Midsize', 'Heavy', 'UltraLong'];

const jetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    manufacturer: { type: String, trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    seats: { type: Number, required: true, min: 1 },
    rangeNM: { type: Number, required: true, min: 1 },      // nautical miles
    speedKts: { type: Number, required: true, min: 1 },     // knots
    hourlyRate: { type: Number, required: true, min: 0 },   // USD per hour
    baseAirport: { type: String, trim: true },              // e.g., "KTEB"
    amenities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],                 // URLs for now
    description: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }              // hide from public if false
  },
  { timestamps: true }
);

module.exports = mongoose.model('Jet', jetSchema);
module.exports.CATEGORIES = CATEGORIES;
