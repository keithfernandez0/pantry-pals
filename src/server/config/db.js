const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection logic on startup
pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to MySQL Database at Kean University!');
    connection.release();
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL database:', err.message);
  });

module.exports = pool;
