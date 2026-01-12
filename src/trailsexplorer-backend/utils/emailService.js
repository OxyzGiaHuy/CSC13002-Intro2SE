const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`[DEBUG] Preparing to send email to: ${to}`);
        console.log(`[DEBUG] SMTP Config: Host=smtp.gmail.com, Port=587, User=${process.env.EMAIL_USER ? 'Set' : 'Missing'}`);

        // Cấu hình đơn giản nhất cho Gmail
        // Lưu ý: Nếu Render Free Tier chặn kết nối SMTP (Timeout), hãy sử dụng Link Xác Thực trong log server.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
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