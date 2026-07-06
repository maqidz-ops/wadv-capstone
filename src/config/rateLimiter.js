const rateLimit = require('express-rate-limit');

// Limiter global untuk semua endpoint API
const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // // 15 menit
  max:             100,            // // 100 request per IP
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    error: {
      code:    'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak request dari IP ini. Coba lagi dalam 15 menit.',
    },
  },
});

// Limiter khusus untuk endpoint autentikasi (login)
const authLimiter = rateLimit({
  windowMs:              15 * 60 * 1000,
  max:                   100,         
  skipSuccessfulRequests: true,         
  message: {
    error: {
      code:    'TOO_MANY_ATTEMPTS',
      message: 'Terlalu banyak percobaan login. Tunggu 15 menit.',
    },
  },
});

// Limiter untuk endpoint yang sangat sensitif (misal: reset password)
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // // 1 jam
  max:      20,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'Batas request tercapai.' }
  },
});

module.exports = { apiLimiter, authLimiter, sensitiveLimiter };