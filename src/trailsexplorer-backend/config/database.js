const { Sequelize } = require('sequelize');

// Load env nếu chưa có
if (!process.env.DB_HOST) {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  require('dotenv').config({ path: envFile, override: true });
}

const isProduction = process.env.NODE_ENV === 'production';

console.log(`Kết nối Sequelize tới: ${process.env.DB_HOST}`);
console.log(`Chế độ SSL: ${isProduction ? 'BẬT' : 'TẮT (Dev Mode)'}`);

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: false,
      dialectOptions: isProduction ? {
        // Chỉ bật SSL nếu là Production (AWS)
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {} // Nếu là Dev (Local) thì để trống -> Không dùng SSL
    }
  );

module.exports = sequelize;