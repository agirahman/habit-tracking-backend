import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import habitRoutes from './src/routes/habitRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import aiRoutes from './src/routes/aiRoutes.js';

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/habits', habitRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/', (req, res) => res.send('Hello, Habit Tracker!'));

// Error handler
app.use(errorHandler);

// Connect to database for Vercel
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  connectDB(process.env.MONGO_URI).catch(err => {
    console.error('Failed to connect to database:', err);
  });
}

// Export for Vercel
export default app;

// Local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (err) {
      console.error('Failed to start server', err);
      process.exit(1);
    }
  };

  start();
}