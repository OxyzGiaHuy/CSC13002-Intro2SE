const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`[DEBUG] Preparing to send email to: ${to}`);
        console.log(`[DEBUG] SMTP Config: Host=smtp.gmail.com, Port=465, User=${process.env.EMAIL_USER ? 'Set' : 'Missing'}`);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // SSL
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 20000, // Tăng lên 20s
            greetingTimeout: 20000,
            socketTimeout: 20000
        });

        // Verify connection config
        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log('[DEBUG] SMTP Connection Error:', error);
                    reject(error);
                } else {
                    console.log("[DEBUG] Server is ready to take our messages");
                    resolve(success);
                }
            });
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