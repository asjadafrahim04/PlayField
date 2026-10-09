import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PlayField backend is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Root route (optional friendly welcome)
app.get('/', (req, res) => {
  res.send('Welcome to PlayField API. Visit /api/health to test.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🧪 Test the API: http://localhost:${PORT}/api/health`);
});