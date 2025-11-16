// backend/src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI is missing. Set it in your .env file.');
  }
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // keep options minimal; mongoose 8 uses sane defaults
  });

  const { host, port, name } = mongoose.connection;
  console.log(`[DB] Connected: ${host}:${port}/${name}`);
}

module.exports = connectDB;
