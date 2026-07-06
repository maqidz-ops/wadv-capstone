const xss = require('xss');

function sanitizeValue(val) {
  if (typeof val === 'string') {
    return xss(val);
  }
  if (val instanceof Date) {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(item => sanitizeValue(item));
  }
  if (typeof val === 'object' && val !== null) {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, sanitizeValue(v)])
    );
  }
  return val;
}

// Middleware Utama untuk Express
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    // Memproses seluruh req.body menggunakan fungsi pembantu
    req.body = sanitizeValue(req.body);
  }
  // Lanjut ke middleware / route berikutnya
  next();
}

// Diekspor dengan nama sanitizeBody agar cocok dengan yang diimport di tasks.routes.js
module.exports = { sanitizeBody };