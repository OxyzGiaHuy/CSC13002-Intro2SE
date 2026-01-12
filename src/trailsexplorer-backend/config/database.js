const { Sequelize } = require('sequelize');

// Load env nếu chưa có
if (!process.env.DB_HOST) {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  require('dotenv').config({ path: envFile, override: true });
}

const isProduction = process.env.NODE_ENV === 'production';

console.log(`Kết nối Sequelize tới: ${process.env.DB_HOST}`);
console.log(`Chế độ SSL: ${isProduction ? 'BẬT' : 'TẮT (Dev Mode)'}`);

const sequelize = (() => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  }

  // Checking for individual credentials
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    return new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        dialectOptions: isProduction ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } : {}
      }
    );
  }

  // If we get here, neither DATABASE_URL nor individual credentials are set
  console.error("❌ ERROR: Missing database configuration. Please set DATABASE_URL (for Render/Neon) or DB_HOST/DB_USER/DB_NAME (for local).");
  return new Sequelize('sqlite::memory:'); // Fallback to prevent immediate crash, but app won't work
})();

module.exports = sequelize;