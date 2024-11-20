const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');

// Load environment variables from .env file
dotenv.config();
const _dirname = path.resolve();

const app = express();

// Configure CORS to allow requests from any origin (adjust in production)
app.use(cors({
  origin: '*', // Update to a specific origin in production for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(_dirname, "/frontend/dist")));

// Create MySQL connection pool with detailed configuration
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost', // Update host if using a remote server
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fun',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0
});

// Test database connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    console.error('Ensure the database server is running and accessible.');
    process.exit(1); // Exit if the database is not accessible
  }
  console.log('Successfully connected to the database');
  connection.release();
});

// Function to fetch jokes from the database
const fetchJokesFromDB = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err.message);
        reject(new Error('Database connection failed'));
        return;
      }

      connection.query('SELECT * FROM jokes', (error, results) => {
        connection.release(); // Always release the connection

        if (error) {
          console.error('Error executing query:', error.message);
          reject(new Error('Failed to fetch jokes'));
          return;
        }
        resolve(results);
      });
    });
  });
};

// API endpoint to fetch jokes
app.get('/post', async (req, res) => {
  try {
    const jokes = await fetchJokesFromDB();
    res.json(jokes);
  } catch (error) {
    console.error('Error fetching jokes:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Please try again later'
    });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Please try again later'
  });
});

// Start the server and bind to 0.0.0.0 for external access
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Accessible from other devices if the network allows.`);
});