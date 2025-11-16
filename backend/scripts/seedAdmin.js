// backend/scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');

const connectDB = require('../src/config/db');   // same helper as jets seeder
const User = require('../src/models/User');

(async () => {
  try {
    const uri =
      process.env.MONGO_URI ||       // <-- match seedJets.js
      process.env.MONGODB_URI ||     // fallback names if you ever switch
      process.env.DATABASE_URL;

    if (!uri) {
      console.error('❌ Missing MONGO_URI (or MONGODB_URI / DATABASE_URL) in .env');
      process.exit(1);
    }

    await connectDB(uri);
    console.log('[DB] Connected');

    const email = 'admin@example.com';
    const password = 'Admin#123';
    const name = 'Platform Admin';

    const hash = await bcrypt.hash(password, 10);

    // Upsert admin user
    const admin = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hash,
        role: 'admin',          // <-- make sure your User schema supports this value
        isEmailVerified: true,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('✅ Admin ready:', {
      email: admin.email,
      role: admin.role,
      id: admin._id.toString(),
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();
