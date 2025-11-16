const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jet: { type: mongoose.Schema.Types.ObjectId, ref: 'Jet', required: true },

    origin: { type: String, required: true },
    destination: { type: String, required: true },

    departureAt: { type: Date, required: true },
    arrivalAt: { type: Date, required: true },

    flightHours: { type: Number, default: 1 },
    priceUSD: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Enroute', 'Completed', 'Cancelled'],
      default: 'Pending'
    },

    notes: { type: String },

    // NEW: status timeline
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'Confirmed', 'Enroute', 'Completed', 'Cancelled'],
          required: true
        },
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // admin/staff who changed it
      }
    ]
  },
  { timestamps: true }
);

// seed first history on create
BookingSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{ status: this.status, at: new Date() }];
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
