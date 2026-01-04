const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

// 1. Load biến môi trường
dotenv.config();

// Load cấu hình DB (để kích hoạt code kiểm tra kết nối trong db.js)
require('./config/db'); 

// Load cấu hình CORS
const corsOptions = require('./config/corsOptions'); 

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Implement Middleware
// Sử dụng corsOptions đã config thay vì cors() mặc định
app.use(cors(corsOptions)); 

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routes
// Route cho trang chủ (Fix lỗi Cannot GET /)
app.get('/', (req, res) => {
    res.send('TrailsExplorer API is running...');
});

// Endpoint kiểm tra sức khỏe hệ thống
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is healthy and ready to rock!' 
    });
});

// Route test lỗi
app.get('/api/test-error', (req, res) => {
    res.status(400);
    throw new Error('Đây là lỗi thử nghiệm từ TrailsExplorer!');
});

// 4. Implement Error Middleware (Phải đặt SAU các routes)
app.use(errorHandler);

// 5. Khởi động Server
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    // console.log(`Environment: ${process.env.NODE_ENV}`);
});