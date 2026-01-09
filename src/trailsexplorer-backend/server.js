const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');


const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

console.log(`🚀 Server đang khởi động ở chế độ: ${process.env.NODE_ENV}`);
console.log(`📂 Đang load cấu hình từ file: ${envFile}`);

// Load cấu hình CORS
const corsOptions = require('./config/corsOptions');

// Import Sequelie Database Config & Models
const sequelize = require('./config/database');
const User = require('./models/User');
const Trail = require('./models/Trail');
const Review = require('./models/Review');
const CommunityPost = require('./models/CommunityPost');
const Favorite = require('./models/Favorite');
const SavedPlan = require('./models/SavedPlan');
const authRoutes = require('./routes/auth');
const trailRoutes = require('./routes/trails');
const communityRoutes = require('./routes/community');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');
const logger = require('./config/logger');
const morgan = require('morgan'); 

// IMPORTANT: Existing db (pg client) might be used by /api/test-db
const db = require('./config/db'); // Keeping for existing endpoints if they work.

const app = express();
const PORT = process.env.PORT || 5000;

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            // Loại bỏ ký tự xuống dòng thừa và ghi vào logger
            logger.info(message.trim());
        }
    }
}));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trails', trailRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('TrailsExplorer API is running... (Updated with Auth)');
});

// Endpoint kiểm tra sức khỏe hệ thống
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         message: 'Server is healthy and ready to rock!'
//     });
// });

app.get('/api/health', async (req, res) => {
    try {
        // Thử query nhẹ vào DB
        await sequelize.authenticate();
        
        res.status(200).json({
            status: 'OK',
            timestamp: new Date(),
            uptime: process.uptime(),
            database: 'Connected',
            memoryUsage: process.memoryUsage()
        });
    } catch (error) {
        // Nếu DB chết, trả về lỗi 503 (Service Unavailable)
        logger.error(`Health Check Failed: ${error.message}`);
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date(),
            database: 'Disconnected',
            error: error.message
        });
    }
});

// Route test DB data (Legacy using raw pg)
app.get('/api/test-db', async (req, res, next) => {
    try {
        // Reuse existing logic but maybe via Sequelize if db.query fails? 
        // If db.js connects via pg, it should work independently.
        const users = await db.query('SELECT user_id, username, email, role FROM users LIMIT 5');
        const trails = await db.query('SELECT trail_id, name, location_province FROM trails LIMIT 5');

        res.json({
            message: 'Kết nối Database thành công! Dưới đây là dữ liệu mẫu:',
            user_count: users.rowCount,
            users: users.rows,
            trail_count: trails.rowCount,
            trails: trails.rows
        });
    } catch (error) {
        // Fallback or just error
        next(error);
    }
});

app.get('/api/test-error', (req, res) => {
    res.status(400);
    throw new Error('Đây là lỗi thử nghiệm từ TrailsExplorer!');
});

// Error Middleware
app.use(errorHandler);

// Start Server with Sequelize Sync
// This replaces the simple app.listen 
// sequelize.sync()
//     .then(() => {
//         console.log('Database connected successfully'); // Requirement specified this log message
//         app.listen(PORT, () => {
//             console.log(`Server is running on: http://localhost:${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.log('❌ Lỗi kết nối Sequelize:', err);
//     });

sequelize.sync()
    .then(() => {
        logger.info('Database connected successfully'); // Dùng logger thay console.log
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
    .catch(err => {
        logger.error(`❌ Lỗi kết nối Sequelize: ${err.message}`);
    });

module.exports = app;