const { Sequelize } = require('sequelize');

// Load biến môi trường nếu chưa có
if (!process.env.DB_HOST) {
    const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
    require('dotenv').config({ path: envFile });
}

// Kiểm tra xem có phải Production không
const isProduction = process.env.NODE_ENV === 'production';

console.log(`🔌 Sequelize đang kết nối tới: ${process.env.DB_HOST}`);
console.log(`🔒 Chế độ SSL: ${isProduction ? 'BẬT (Require)' : 'TẮT'}`);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Tắt log query cho gọn
        // --- CẤU HÌNH SSL BẮT BUỘC CHO AWS ---
        dialectOptions: isProduction ? {
            ssl: {
                require: true, // Bắt buộc dùng SSL
                rejectUnauthorized: false // Chấp nhận chứng chỉ AWS
            }
        } : {}
    }
);

module.exports = sequelize;