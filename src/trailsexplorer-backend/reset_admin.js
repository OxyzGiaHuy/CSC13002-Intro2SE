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
            // Set raw password - the beforeCreate hook will hash it automatically
            await User.create({
                username: 'admin',
                email: adminEmail,
                password: newPassword,
                role: 'ADMIN',
                full_name: 'System Administrator',
                is_email_verified: true,
                is_active: true
            });
            console.log("\n✅ Admin user created with email: ${adminEmail} and password: ${newPassword}\n");
            return;
        }

        // Set raw password - the beforeUpdate hook will hash it automatically
        admin.password = newPassword;
        admin.role = 'ADMIN'; // Ensure role is ADMIN
        admin.is_email_verified = true; // Ensure email is verified
        admin.is_active = true; // Ensure account is active
        await admin.save();

        console.log("\n✅ Password for ${adminEmail} has been reset to: ${newPassword}\n");

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

resetAdminPassword();
