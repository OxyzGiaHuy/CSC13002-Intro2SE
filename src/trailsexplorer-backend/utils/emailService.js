const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 10000 // 10 seconds
        });

        const mailOptions = {
            from: `"TrailsExplorer Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        return false;
    }
};

module.exports = sendEmail;