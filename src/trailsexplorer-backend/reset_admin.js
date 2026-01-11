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
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log(`\n✅ Admin user created with email: ${adminEmail} and password: ${newPassword}\n`);
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedPassword;
        admin.role = 'ADMIN'; // Ensure role is ADMIN
        await admin.save();

        console.log(`\n✅ Password for ${adminEmail} has been reset to: ${newPassword}\n`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

resetAdminPassword();
