const jwt = require('jsonwebtoken'); 

const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const logger = require('../config/logger');

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
    try {
        const { full_name, email, password } = req.body;

        // 1. Validate dữ liệu đầu vào
        if (!full_name || !email || !password) {
            res.status(400);
            throw new Error('Vui lòng điền đầy đủ thông tin (Họ tên, Email, Mật khẩu)');
        }

        // 2. Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            res.status(400);
            throw new Error('Email này đã được sử dụng. Vui lòng chọn email khác.');
        }

        const baseName = email.split('@')[0];
        const randomNum = Math.floor(1000 + Math.random() * 9000); // Số từ 1000-9999
        const generatedUsername = `${baseName}${randomNum}`;

        // 3. Tạo User mới vào Database
        // (Lưu ý: Password sẽ tự động được hash nhờ hook trong models/User.js)
        const user = await User.create({
            full_name,
            email,
            password,
            username: generatedUsername
        });

        if (user) {
            // Tạo token hết hạn sau 24 giờ
            const verificationToken = jwt.sign(
                { id: user.id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Tạo đường dẫn xác thực
            // Lưu ý: Nếu có Frontend thì trỏ về Frontend. 
            // Hiện tại test Backend thì trỏ thẳng vào API Backend để click là chạy luôn.
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? 'http://localhost:8000' // Hoặc domain thật nếu có
                : 'http://localhost:5000';
                
            const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

            // 4. Gửi email chào mừng (Chạy bất đồng bộ, không cần đợi gửi xong mới phản hồi)
            const emailSubject = 'Xác thực tài khoản TrailsExplorer';
            const emailBody = `
                <h3>Xin chào ${user.full_name},</h3>
                <p>Cảm ơn bạn đã đăng ký. Vui lòng click vào link dưới đây để xác thực email:</p>
                <a href="${verificationUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác thực ngay</a>
                <p>Hoặc copy link này: ${verificationUrl}</p>
                <p>Link này sẽ hết hạn sau 24 giờ.</p>
            `;
            
            // Gọi hàm gửi mail
            sendEmail(user.email, emailSubject, emailBody);

            // 5. Trả về kết quả thành công
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công! Vui lòng kiểm tra email.',
                data: {
                    user_id: user.user_id,
                    username: user.username,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400);
            throw new Error('Dữ liệu người dùng không hợp lệ');
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            // Lấy chi tiết lỗi từ Sequelize (ví dụ: email must be unique)
            const message = error.errors.map(err => err.message).join(', ');
            res.status(400);
            // Thay đổi thông báo lỗi mặc định thành chi tiết cụ thể
            error.message = message; 
        }
        next(error); // Chuyển lỗi sang middleware xử lý lỗi
    }
};

// @desc    Xác thực email qua token
// @route   GET /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query; // Lấy token từ URL (?token=...)

        if (!token) {
            res.status(400);
            throw new Error('Link xác thực không hợp lệ (Thiếu token)');
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tìm user theo ID trong token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            res.status(404);
            throw new Error('Không tìm thấy người dùng');
        }

        // Kiểm tra xem đã xác thực chưa
        if (user.is_email_verified) {
            return res.status(200).send('<h1>Email này đã được xác thực trước đó rồi! ✅</h1>');
        }

        // Cập nhật trạng thái
        user.is_email_verified = true;
        await user.save();

        // Trả về giao diện đơn giản báo thành công
        res.status(200).send(`
            <div style="text-align: center; padding-top: 50px;">
                <h1 style="color: green;">Xác thực thành công! 🎉</h1>
                <p>Chào mừng <b>${user.full_name}</b>, tài khoản của bạn đã được kích hoạt.</p>
                <p>Bây giờ bạn có thể đăng nhập vào ứng dụng.</p>
            </div>
        `);

    } catch (error) {
        res.status(400).send(`<h1 style="color: red;">Xác thực thất bại! ❌</h1><p>${error.message}</p>`);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate đầu vào
        if (!email || !password) {
            res.status(400);
            throw new Error('Vui lòng nhập email và mật khẩu');
        }

        // 2. Tìm user trong DB
        const user = await User.findOne({ where: { email } });

        // 3. Kiểm tra user tồn tại và mật khẩu đúng
        if (user && (await user.matchPassword(password))) {
            
            // --- ĐOẠN CODE QUAN TRỌNG CẦN THÊM ---
            // Kiểm tra xem đã xác thực email chưa
            if (!user.is_email_verified) {
                res.status(401); // 401 Unauthorized
                throw new Error('Tài khoản chưa được xác thực. Vui lòng kiểm tra email để kích hoạt!');
            }

            // Kiểm tra xem tài khoản có bị khóa không (is_active)
            if (!user.is_active) {
                res.status(403); // 403 Forbidden
                throw new Error('Tài khoản của bạn đã bị khóa.');
            }
            // -------------------------------------

            // 4. Nếu mọi thứ OK, cấp Token
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user_id: user.user_id,
                    username: user.username,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.user_id) // Hàm tạo token bạn đã có hoặc dùng jwt.sign trực tiếp
                }
            });
        } else {
            res.status(401);
            throw new Error('Email hoặc mật khẩu không chính xác');
        }
    } catch (error) {
        next(error);
    }
};

// Hàm phụ trợ tạo token (Nếu bạn chưa có thì thêm vào cuối file)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};