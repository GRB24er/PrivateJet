// backend/scripts/seedJets.js
require('dotenv').config();
const connectDB = require('../src/config/db');
const Jet = require('../src/models/Jet');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const samples = [
      {
        name: 'Cessna Citation CJ4',
        manufacturer: 'Cessna',
        category: 'Light',
        seats: 7,
        rangeNM: 2165,
        speedKts: 451,
        hourlyRate: 3500,
        baseAirport: 'KTEB',
        amenities: ['Wi-Fi', 'Refreshments'],
        images: [],
        description: 'Efficient light jet ideal for regional hops.',
        isAvailable: true,
        isActive: true
      },
      {
        name: 'Bombardier Challenger 350',
        manufacturer: 'Bombardier',
        category: 'Midsize',
        seats: 9,
        rangeNM: 3200,
        speedKts: 459,
        hourlyRate: 5400,
        baseAirport: 'KVNY',
        amenities: ['Wi-Fi', 'Galley', 'Lie-flat seats'],
        images: [],
        description: 'Popular midsize with comfort and range.',
        isAvailable: true,
        isActive: true
      },
      {
        name: 'Gulfstream G650ER',
        manufacturer: 'Gulfstream',
        category: 'UltraLong',
        seats: 14,
        rangeNM: 7500,
        speedKts: 516,
        hourlyRate: 11000,
        baseAirport: 'KHPN',
        amenities: ['Wi-Fi', 'Conference area', 'Bedroom'],
        images: [],
        description: 'Ultra long-range flagship for intercontinental travel.',
        isAvailable: true,
        isActive: true
      }
    ];

    await Jet.deleteMany({});
    await Jet.insertMany(samples);
    console.log('Seeded jets:', samples.length);
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e.message);
    process.exit(1);
  }
})();
