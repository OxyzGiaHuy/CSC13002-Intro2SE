const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./config/database');

async function resetAdminPassword() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const adminEmail = 'admin@trailsexplorer.com';
        const newPassword = 'password123';

        const admin = await User.findOne({ where: { email: adminEmail } });

        if (!admin) {
            console.log('Admin user not found! Creating new admin user...');
            // Hook 'beforeCreate' will hash the password. pass plain text.
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: newPassword,
                role: 'ADMIN',
                is_email_verified: true,
                is_active: true
            });
            console.log(`\n✅ Admin user created with email: ${adminEmail} and password: ${newPassword}\n`);
            return;
        }

        // Fix: Do NOT hash here manually. The User model 'beforeUpdate' hook will hash it automatically.
        // If we hash here, it gets hashed TWICE (once here, once in hook), causing login failure.
        admin.password = newPassword;
        admin.role = 'ADMIN'; // Ensure role is ADMIN
        admin.is_email_verified = true;
        admin.is_active = true;
        await admin.save();

        console.log(`\n✅ Password for ${adminEmail} has been reset to: ${newPassword}\n`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

resetAdminPassword();
