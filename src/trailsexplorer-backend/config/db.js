const { Pool } = require('pg');

if (!process.env.DB_HOST) {
    const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
    require('dotenv').config({ path: envFile, override: true });
}

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  
  // Chỉ bật SSL nếu là Production
  ssl: isProduction ? {
    rejectUnauthorized: false
  } : false 
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('[pg] Lỗi kết nối:', err.message);
    }
    console.log(`[pg] Đã kết nối thành công tới: ${process.env.DB_NAME}`);
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};