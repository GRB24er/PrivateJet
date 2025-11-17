// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const app = express();

// Trust proxy (needed for correct IPs when behind Nginx/Render)
app.set('trust proxy', 1);

/**
 * CORS – allow:
 *  - local dev: http://localhost:5173
 *  - Vercel:    https://private-jet-pwt8.vercel.app
 *
 * We keep it explicit so you don't fight env vars.
 */
const allowedOrigins = [
  'http://localhost:5173',
  'https://private-jet-pwt8.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Block anything else (you can log if you want)
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// Handle preflight for all routes
app.options(
  '*',
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin (OPTIONS): ${origin}`));
    },
    credentials: true,
  })
);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Gzip
app.use(compression());

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate limiting (tighter in prod)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// ---- Routes ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/jets', require('./routes/jet.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/users', require('./routes/user.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
