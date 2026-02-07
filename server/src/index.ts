import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { runMigrations } from './db/pool.js';
import recordsRouter from './routes/records.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', limiter); // Apply rate limiting to all API routes

// Health check endpoint with diagnostics
app.get('/health', async (req, res) => {
  const health: {
    status: string;
    timestamp: string;
    uptime: number;
    environment: {
      nodeVersion: string;
      port: string | number;
    };
    database?: string;
    databaseError?: string;
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      port: PORT,
    }
  };
  
  // Check database connection
  try {
    const { default: pool } = await import('./db/pool.js');
    await pool.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
    health.databaseError = error instanceof Error ? error.message : 'Unknown error';
  }
  
  res.json(health);
});

// Routes
app.use('/api/records', recordsRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    // Run database migrations
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
