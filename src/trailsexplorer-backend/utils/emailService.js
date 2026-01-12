const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`[DEBUG] Preparing to send email to: ${to}`);
        console.log(`[DEBUG] SMTP Config: Host=smtp.gmail.com, Port=587, User=${process.env.EMAIL_USER ? 'Set' : 'Missing'}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
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
        logger.info(`Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        return false;
    }
};

module.exports = sendEmail;