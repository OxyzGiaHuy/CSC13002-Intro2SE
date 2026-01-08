const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User'); // Import model để tự tạo bảng
const authRoutes = require('./routes/auth'); // Import API đăng nhập

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Server Trekking đang chạy ngon lành!');
});

const PORT = process.env.PORT || 5000;

// Kết nối Database & Chạy Server
sequelize.sync()
    .then(() => {
        console.log('✅ ĐÃ KẾT NỐI DATABASE THÀNH CÔNG!');
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.log('❌ Lỗi kết nối:', err);
    });