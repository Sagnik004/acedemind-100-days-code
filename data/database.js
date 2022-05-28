const mysql = require('mysql2/promise');

const dbConnPool = mysql.createPool({
  host: process.env.DB_URL,
  user: process.env.DB_USERID,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = dbConnPool;
