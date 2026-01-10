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
            throw new Error('Please provide full name, email and password');
        }

        // 2. Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            res.status(400);
            throw new Error('This email is already in use. Please choose a different email.');
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
            // ... (Đoạn tạo verificationUrl giữ nguyên) ...

            // --- GIAO DIỆN EMAIL CHUYÊN NGHIỆP ---
            const emailSubject = 'Verify your TrailsExplorer account';

            const emailBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Email</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8;">
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 20px 0 30px 0;">
                            
                            <!-- MAIN CONTAINER -->
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                
                                <!-- HEADER -->
                                <tr>
                                    <td align="center" bgcolor="#2E7D32" style="padding: 40px 0 30px 0;">
                                        <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">
                                            TrailsExplorer
                                        </h1>
                                    </td>
                                </tr>

                                <!-- BODY CONTENT -->
                                <tr>
                                    <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #333333; font-size: 18px; font-weight: 600;">
                                                    Hello ${user.full_name},
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 0 30px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                                    Thank you for joining the <b>TrailsExplorer</b> community! <br/>
                                                    To begin exploring breathtaking trails and adventures, please verify your email address by clicking the button below.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center" bgcolor="#2E7D32" style="border-radius: 5px;">
                                                                <a href="${verificationUrl}" target="_blank"
                                                                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif;
                                                                color: #ffffff; text-decoration: none; border-radius: 5px;
                                                                padding: 12px 35px; border: 1px solid #2E7D32;
                                                                display: inline-block; font-weight: bold;">
                                                                    Verify Email Now
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 30px 0 0 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                                    This link will expire in <b>24 hours</b>. If you did not create this account, please ignore this email.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- FOOTER / FALLBACK LINK -->
                                <tr>
                                    <td bgcolor="#f8f9fa" style="padding: 30px; border-top: 1px solid #eeeeee;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #888888; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
                                                    <p style="margin: 0 0 10px 0;">
                                                        If the button above does not work, please copy and paste the link below into your browser:
                                                    </p>
                                                    <p style="margin: 0; word-break: break-all;">
                                                        <a href="${verificationUrl}" style="color: #2E7D32;">
                                                            ${verificationUrl}
                                                        </a>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 0 0 0; color: #aaaaaa; font-family: Arial, sans-serif; font-size: 12px; text-align: center;">
                                                    &copy; 2024 TrailsExplorer System.<br/>
                                                    This is an automated email. Please do not reply.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `;
            
            // Gọi hàm gửi mail
            sendEmail(user.email, emailSubject, emailBody);

            // 5. Trả về kết quả thành công
            res.status(201).json({
                success: true,
                message: 'Registration successful! Please check your email.',
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
            throw new Error('Invalid user data');
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
            throw new Error('Invalid verification link (Missing token)');
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tìm user theo ID trong token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Kiểm tra xem đã xác thực chưa
        if (user.is_email_verified) {
            return res.status(200).send('<h1>This email has already been verified!</h1>');
        }

        // Cập nhật trạng thái
        user.is_email_verified = true;
        await user.save();

        // Trả về giao diện đơn giản báo thành công
        res.status(200).send(`
            <div style="text-align: center; padding-top: 50px;">
                <h1 style="color: green;">Verification successful! 🎉</h1>
                <p>Welcome <b>${user.full_name}</b>, your account has been activated.</p>
                <p>You can now log in to the application.</p>
            </div>
        `);

    } catch (error) {
        res.status(400).send(`<h1 style="color: red;">Verification failed!</h1><p>${error.message}</p>`);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate đầu vào
        if (!email || !password) {
            res.status(400);
            throw new Error('Please enter both email and password');
        }

        // 2. Tìm user trong DB
        const user = await User.findOne({ where: { email } });

        // 3. Kiểm tra user tồn tại và mật khẩu đúng
        if (user && (await user.matchPassword(password))) {
            
            // --- ĐOẠN CODE QUAN TRỌNG CẦN THÊM ---
            // Kiểm tra xem đã xác thực email chưa
            if (!user.is_email_verified) {
                res.status(401); // 401 Unauthorized
                throw new Error('Account not verified. Please check your email to activate!');
            }

            // Kiểm tra xem tài khoản có bị khóa không (is_active)
            if (!user.is_active) {
                res.status(403); // 403 Forbidden
                throw new Error('Your account has been locked.');
            }
            // -------------------------------------

            // 4. Nếu mọi thứ OK, cấp Token
            res.json({
                success: true,
                message: 'Login successful',
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
            throw new Error('Incorrect email or password');
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