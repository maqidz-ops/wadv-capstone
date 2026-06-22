const config = require('./config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/cors');
const { apiLimiter, authLimiter, sensitiveLimiter } = require('./config/rateLimiter');

// Routes
const routes = require('./routes');
const tasksRoutes = require('./routes/tasks.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const taskTagRoutes = require('./routes/taskTagRoutes');

const authenticate = require('./middleware/authenticate');
const setupSwagger = require('./docs/swagger');

const app = express();

app.use(helmet());

// CORS configuration
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight untuk semua route

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting middleware
app.use('/api/', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// Routes
app.use('/', routes); // /health
app.use('/api', routes); // /api/info, /api/echo/:msg

// Auth routes rate limiting
app.use('/auth/login', authLimiter);
app.use('/auth/refresh', sensitiveLimiter);
app.use('/auth', authRoutes);

// Middleware untuk melindungi rute API v1 dengan autentikasi JWT
app.use('/api/v1', (req, res, next) => {
  // Jika request mengarah ke auth, langsung loloskan tanpa cek token
  if (req.path.startsWith('/auth')) {
    return next();
  }
  // Selain rute auth, wajib melewati validasi token
  return authenticate(req, res, next);
});

// --- API Routes yang dilindungi ----------------------------
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/task-tags', taskTagRoutes);

// Setup Swagger UI untuk dokumentasi API
setupSwagger(app);

// 404 handler untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // CORS error
  if (err.message && err.message.includes('tidak diizinkan oleh CORS')) {
    return res.status(403).json({
      error: { code: 'CORS_ERROR', message: err.message },
    });
  }

  // Auth service errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code || 'AUTH_ERROR', message: err.message },
    });
  }

  // Prisma P2002 duplicate
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'DUPLICATE_RESOURCE', message: 'Data sudah digunakan.' },
    });
  }

  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: config.env === 'development' ? err.message : 'Terjadi kesalahan.',
    },
  });
});

// Start the server
app.listen(config.port, () => {
  console.log('─'.repeat(55));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.env}`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log(` Docs        : http://localhost:${config.port}/api/docs`);
  console.log(` Security    : Helmet ✓  CORS ✓  Rate Limit ✓`);
  console.log('─'.repeat(55));
});

module.exports = app;