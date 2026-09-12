import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import Movie from './models/Movie.js';
import { seedDatabase } from './seed.js';

import movieRoutes from './routes/movieRoutes.js';
import showtimeRoutes from './routes/showtimeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Pass Pass API is operational.',
    timestamp: new Date().toISOString(),
  });
});

// Manual seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database re-seeded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend static build files (Single localhost serving both frontend & backend)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to React index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Pass Pass Server is running. Please run npm run build to generate the frontend bundle.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error', error: err.message });
});

// Start Server and connect to MongoDB
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  try {
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('[Startup] No movies found in MongoDB. Auto-seeding initial cinema data...');
      await seedDatabase();
    } else {
      console.log(`[Startup] MongoDB already contains ${count} movies.`);
    }
  } catch (err) {
    console.warn('[Startup] Auto-seed check failed:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Pass Pass unified full-stack running at: http://localhost:${PORT}`);
    console.log(`[Server] API Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
