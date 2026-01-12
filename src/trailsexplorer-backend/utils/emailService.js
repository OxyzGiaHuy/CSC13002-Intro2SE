const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`[DEBUG] Preparing to send email to: ${to}`);
        console.log(`[DEBUG] SMTP Config: Host=smtp.gmail.com, Port=587, User=${process.env.EMAIL_USER ? 'Set' : 'Missing'}`);

        // Cấu hình tối ưu cho Render: Port 587 + Force IPv4
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // false cho port 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false // Bỏ qua lỗi SSL nếu có proxy
            },
            family: 4 // QUAN TRỌNG: Chỉ dùng IPv4 để tránh lỗi timeout do IPv6 trên Render
        });

        const mailOptions = {
            from: `"TrailsExplorer Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[DEBUG] Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        return false;
    }
};

module.exports = sendEmail;