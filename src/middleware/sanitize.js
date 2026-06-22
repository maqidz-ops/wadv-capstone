const xss = require('xss');

// Middleware untuk membersihkan input dari XSS
function sanitizeInput(req, res, next) {
  // Membersihkan semua properti dalam req.body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      const val = req.body[key];
      if (typeof val === 'string') {
        return xss(val);
      }
      if (typeof val === 'object' && val !== null) {
        return Object.fromEntries(
          Object.entries(val).map(([k, v]) => [k, sanitizeValue(v)])
        );
      }
      return val;
    };
    req.body = sanitizeValue(req.body);
  }
  next();
};

module.exports = { sanitizeBody };