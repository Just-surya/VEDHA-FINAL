import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { isSupabaseConfigured } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { getAttendanceTrend, getTermMeta } from './controllers/statsController.js';
import { getStaffList } from './controllers/authController.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ====================================================================
// CORS Configuration
// ====================================================================
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow if origin is explicitly in allowed list or is a Vercel preview/production URL
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Request logger for development
if (config.nodeEnv !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (!req.url.startsWith('/api/health')) {
        console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });
}

// ====================================================================
// Health Check Endpoints
// ====================================================================
const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Local Data Store',
    environment: config.nodeEnv,
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// ====================================================================
// API Route Declarations (/api/...)
// ====================================================================
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/stats', statsRoutes);
app.get('/api/attendanceTrend', getAttendanceTrend);
app.get('/api/termMeta', getTermMeta);
app.get('/api/staff', getStaffList);

// ====================================================================
// Legacy Route Aliases (for seamless backward compatibility)
// ====================================================================
app.use('/students', studentRoutes);
app.get('/attendanceTrend', getAttendanceTrend);
app.get('/termMeta', getTermMeta);
app.get('/staff', getStaffList);

// ====================================================================
// 404 & Centralized Error Handler
// ====================================================================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Vedha API.`,
  });
});

app.use(errorHandler);

export default app;
