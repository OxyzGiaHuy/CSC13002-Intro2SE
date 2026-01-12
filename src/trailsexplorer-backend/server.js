// File server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

// =====================
// LOAD ENV THEO MÔI TRƯỜNG
// =====================
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env';

dotenv.config({ path: envFile });

// Debug log (rất quan trọng khi chạy PM2)
console.log(`Server đang khởi động ở chế độ: ${process.env.NODE_ENV || 'development'}`);
console.log(`Đang load cấu hình từ file: ${envFile}`);

// =====================
// LOAD CORS CONFIG
// =====================
const corsOptions = require('./config/corsOptions');

// =====================
// DATABASE & MODELS
// =====================
const sequelize = require('./config/database');
const User = require('./models/User');
const Trail = require('./models/Trail');
const Review = require('./models/Review');
const MarketplaceItem = require('./models/MarketplaceItem');
const Group = require('./models/Group');
const GroupMember = require('./models/GroupMember');
const Challenge = require('./models/Challenge');
const CommunityPost = require('./models/CommunityPost');
const Favorite = require('./models/Favorite');
const SavedPlan = require('./models/SavedPlan');
const UserChallenge = require('./models/UserChallenge');
const Comment = require('./models/Comment');

// =====================
// ASSOCIATIONS
// =====================
User.belongsToMany(Challenge, { through: UserChallenge, foreignKey: 'user_id' });
Challenge.belongsToMany(User, { through: UserChallenge, foreignKey: 'challenge_id' });
User.hasMany(UserChallenge, { foreignKey: 'user_id' });
Challenge.hasMany(UserChallenge, { foreignKey: 'challenge_id' });
UserChallenge.belongsTo(User, { foreignKey: 'user_id' });
UserChallenge.belongsTo(User, { foreignKey: 'user_id' });
UserChallenge.belongsTo(Challenge, { foreignKey: 'challenge_id' });

// Comments
Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(CommunityPost, { foreignKey: 'post_id' });
CommunityPost.hasMany(Comment, { foreignKey: 'post_id' });

// Routes
const authRoutes = require('./routes/auth');
const trailRoutes = require('./routes/trails');
const communityRoutes = require('./routes/community');
const marketplaceRoutes = require('./routes/marketplace');
const groupRoutes = require('./routes/groups');
const challengeRoutes = require('./routes/challenges');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

// Legacy raw pg client 
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =====================
// ROUTES
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/trails', trailRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('TrailsExplorer API is running... (Updated with Auth)');
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy and ready to rock!'
  });
});

// Test DB (legacy pg)
app.get('/api/test-db', async (req, res, next) => {
  try {
    const users = await db.query(
      'SELECT user_id, username, email, role FROM users LIMIT 5'
    );
    const trails = await db.query(
      'SELECT trail_id, name, location_province FROM trails LIMIT 5'
    );

    res.json({
      message: 'Kết nối Database thành công! Dữ liệu mẫu:',
      user_count: users.rowCount,
      users: users.rows,
      trail_count: trails.rowCount,
      trails: trails.rows
    });
  } catch (error) {
    next(error);
  }
});

// =====================
// ERROR HANDLER
// =====================
app.use(errorHandler);

// =====================
// START SERVER
// =====================
// Sync Database
// Attempt to enable PostGIS extension before syncing models
sequelize.query("CREATE EXTENSION IF NOT EXISTS postgis;")
  .then(() => sequelize.sync()) // Reverted from { alter: true } to avoid ENUM casting error on startup
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Lỗi kết nối Sequelize:', err));

module.exports = app;
