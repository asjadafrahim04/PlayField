import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'playfield',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Simple test function
export async function testConnection() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    return rows[0].result; // Should be 2
  } finally {
    connection.release();
  }
}

export default pool;