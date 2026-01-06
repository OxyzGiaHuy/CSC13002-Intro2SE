const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load biến môi trường
dotenv.config();

// Load cấu hình CORS
const corsOptions = require('./config/corsOptions');

// Import Sequelie Database Config & Models
const sequelize = require('./config/database');
const User = require('./models/User');
const Trail = require('./models/Trail');
const Review = require('./models/Review');
const authRoutes = require('./routes/auth'); // Import API đăng nhập

// IMPORTANT: Existing db (pg client) might be used by /api/test-db
// We can keep it or replace it, but let's keep it to avoid breaking existing /api/test-db if the user needs it.
// However, typically one connection strategy is best. 
// require('./config/db'); // Commenting this out to rely on Sequelize or keep if checking connectivity independently.
// Let's rely on Sequelize for consistency since the task was "Database Connection & ORM Setup".
// But /api/test-db uses `db.query`. I will rewrite /api/test-db to use sequelize if possible OR just leave it if it works side-by-side. 
// Ideally side-by-side relies on same credentials.
const db = require('./config/db'); // Keeping for existing endpoints if they work.

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes); // NEW: Auth Routes

app.get('/', (req, res) => {
    res.send('TrailsExplorer API is running... (Updated with Auth)');
});

// Endpoint kiểm tra sức khỏe hệ thống
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy and ready to rock!'
    });
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

// Error Middleware
app.use(errorHandler);

// Start Server with Sequelize Sync
// This replaces the simple app.listen 
sequelize.sync()
    .then(() => {
        console.log('Database connected successfully'); // Requirement specified this log message
        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.log('❌ Lỗi kết nối Sequelize:', err);
    });

module.exports = app;