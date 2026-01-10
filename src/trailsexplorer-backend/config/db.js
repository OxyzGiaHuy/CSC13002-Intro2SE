const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Kiểm tra kết nối
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Lỗi kết nối Database:', err.stack);
    }
    console.log('Đã kết nối thành công tới PostgreSQL: trailsexplorer');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};