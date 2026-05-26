const config = require('./config');
const express = require('express');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Routes
app.use('/', routes);
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    hint: 'Kunjungi GET /api/info untuk melihat daftar endpoint.',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    error: 'Internal Server Error',
    message:
      config.env === 'development'
        ? err.message
        : 'Terjadi kesalahan di server.',
  });
});

// Start server
app.listen(config.port, () => {
  console.log('='.repeat(50));
  console.log(`${config.appName} v${config.version}`);
  console.log(`Environment: ${config.env}`);
  console.log(`Server: http://localhost:${config.port}`);
  console.log('='.repeat(50));
});

module.exports = app;