const { Pool } = require('pg');

// Đảm bảo load đúng biến môi trường
if (!process.env.DB_HOST) {
    const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
    require('dotenv').config({ path: envFile });
}

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    // --- QUAN TRỌNG: BẬT SSL CHO AWS RDS ---
    ssl: isProduction ? {
        rejectUnauthorized: false // Chấp nhận chứng chỉ AWS
    } : false
});

// Kiểm tra kết nối
pool.connect((err, client, release) => {
    if (err) {
        // Ghi log lỗi rõ ràng hơn
        return console.error('❌ [pg] Lỗi kết nối:', err.message);
    }
    console.log(`✅ [pg] Đã kết nối thành công tới: ${process.env.DB_NAME}`);
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};