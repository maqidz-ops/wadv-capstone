const config = require('./config');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const helmet = require('helmet');
const cors = require('cors');

const corsOptions = require('./config/cors');
const {
  apiLimiter,
  authLimiter,
  sensitiveLimiter,
} = require('./config/rateLimiter');

// Routes
const routes = require('./routes');
const tasksRoutes = require('./routes/tasks.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const tagRoutes = require('./routes/tagRoutes');
const taskTagRoutes = require('./routes/taskTagRoutes');

const authenticate = require('./middleware/authenticate');
const setupSwagger = require('./docs/swagger');

const app = express();

// HTTP server
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: config.allowedOrigins || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// supaya bisa dipanggil dari controller
app.set('io', io);

// Socket.IO event handlers
require('./socket')(io);

// Security middleware
app.use(helmet());

app.use(cors(corsOptions));

/*
 * EXPRESS 5 FIX
 * Jangan gunakan:
 * app.options('*', cors(corsOptions))
 */
app.options(/.*/, cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10kb',
}));

// ─── 4. Rate Limiting Global ───────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── 5. Request Logger ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── 6. Routes ─────────────────────────────────────────────────────────────
app.use('/', routes);
app.use('/api', routes);

// Auth routes - rate limiting ketat
app.use('/auth/login', authLimiter);
app.use('/auth/refresh', sensitiveLimiter);
app.use('/auth', authRoutes);

// Protected API routes
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/task-tags', tagRoutes);
app.use('/api/v1/task-tags', taskTagRoutes);

// Swagger documentation setup
setupSwagger(app);

// 404 handler
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
  if (
    err.message &&
    err.message.includes('tidak diizinkan oleh CORS')
  ) {
    return res.status(403).json({
      error: {
        code: 'CORS_ERROR',
        message: err.message,
      },
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || 'AUTH_ERROR',
        message: err.message,
      },
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'Data sudah digunakan.',
      },
    });
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        config.env === 'development'
          ? err.message
          : 'Terjadi kesalahan.',
    },
  });
});

// Start the server
server.listen(config.port, () => {
  console.log('─'.repeat(55));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.env}`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log(` Docs        : http://localhost:${config.port}/api/docs`);
  console.log(` Socket.IO   : READY`);
  console.log(` Security    : Helmet ✓  CORS ✓  Rate Limit ✓`);
  console.log('─'.repeat(55));
});

module.exports = app;