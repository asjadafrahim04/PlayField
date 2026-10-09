import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ------- Routes -------

// Root
app.get('/', (req, res) => {
  res.send('Welcome to PlayField API. Visit /api/health to test.');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PlayField backend is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// DB test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await testConnection();
    const [dbInfo] = await pool.query('SELECT DATABASE() AS db, VERSION() AS version');
    res.json({
      status: 'ok',
      message: 'Database connected ✅',
      test_result: result,
      database: dbInfo[0].db,
      mysql_version: dbInfo[0].version,
    });
  } catch (error) {
    console.error('DB test failed:', error.message);
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

// List all tables in the current DB
app.get('/api/db-tables', async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    // MySQL returns keys like "Tables_in_playfield" — normalize to plain array
    const tables = rows.map((row) => Object.values(row)[0]);
    res.json({
      status: 'ok',
      database: process.env.DB_NAME,
      table_count: tables.length,
      tables,
    });
  } catch (error) {
    console.error('DB tables failed:', error.message);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test health:  http://localhost:${PORT}/api/health`);
  console.log(`Test DB:      http://localhost:${PORT}/api/db-test`);
  console.log(`List tables:  http://localhost:${PORT}/api/db-tables`);
});