// backend/scripts/seedDemoClient.js
require('dotenv').config();

const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Jet = require('../src/models/Jet');
const Booking = require('../src/models/Booking');

(async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ Missing MONGODB_URI or MONGO_URI in .env');
      process.exit(1);
    }

    await connectDB(uri);
    console.log('[DB] Connected for client seed');

    const email = 'patrickvanjewell@gmail.com';

    // 1) Make sure client exists with REAL password field
    let client = await User.findOne({ email });

    if (!client) {
      client = await User.create({
        name: 'Patrick Van Jewell',
        email,
        // IMPORTANT: use `password`, NOT `passwordHash`
        // Your User model pre-save hook will hash this.
        password: 'Client#123',
        role: 'client',
      });

      console.log('✅ Created client user:', client.email);
    } else {
      // Force password + role to what we expect
      client.password = 'Client#123';
      client.role = 'client';
      await client.save();
      console.log('ℹ️ Updated existing client user:', client.email);
    }

    // 2) Get jets
    const jets = await Jet.find().sort({ hourlyRate: 1 });

    if (!jets.length) {
      console.error('❌ No jets found. Run `npm run seed:jets` first.');
      process.exit(1);
    }

    const lightJet = jets[0];
    const midJet = jets[1] || jets[0];
    const ultraJet = jets[2] || jets[0];

    const makeDate = (iso) => new Date(iso);

    // 3) Travel history
    const sampleBookings = [
      {
        client: client._id,
        jet: lightJet._id,
        origin: 'KTEB',
        destination: 'KBOS',
        departureAt: makeDate('2024-11-10T14:00:00Z'),
        arrivalAt: makeDate('2024-11-10T15:00:00Z'),
        status: 'Completed',
        price: 8200,
        notes:
          'Day trip for board meeting in Boston. Black car transfer on arrival.',
      },
      {
        client: client._id,
        jet: midJet._id,
        origin: 'KHPN',
        destination: 'KASE',
        departureAt: makeDate('2025-01-20T13:30:00Z'),
        arrivalAt: makeDate('2025-01-20T17:00:00Z'),
        status: 'Completed',
        price: 26500,
        notes:
          "Family ski trip to Aspen. Catering: gluten-free and kids’ menu.",
      },
      {
        client: client._id,
        jet: ultraJet._id,
        origin: 'KTEB',
        destination: 'EGLL',
        departureAt: makeDate('2025-03-22T20:00:00Z'),
        arrivalAt: makeDate('2025-03-23T06:30:00Z'),
        status: 'Pending',
        price: 98500,
        notes:
          'London investor roadshow. Requires Wi-Fi, private bedroom, and quiet cabin for calls.',
      },
    ];

    // 4) Wipe ONLY this client’s old bookings and insert fresh ones
    await Booking.deleteMany({ client: client._id });

    const created = await Booking.insertMany(sampleBookings);
    console.log(`✅ Seeded ${created.length} bookings for client (${client.email})`);

    console.log(`
👤 Client login (REAL account):
  Email:    ${email}
  Password: Client#123

Use this on /login (both local and Vercel) to see Dashboard + My Trips.
    `);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed client error:', err);
    process.exit(1);
  }
})();
