const User = require('./models/User');
const sequelize = require('./config/database');

async function checkAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const admin = await User.findOne({ where: { email: 'admin@trailsexplorer.com' } });
        if (!admin) {
            console.log('❌ Admin user NOT found!');
        } else {
            console.log('✅ Admin User Found:');
            console.log('ID:', admin.id); // Check ID field mapping
            console.log('Username:', admin.username);
            console.log('Role:', admin.role);
            console.log('Is Active:', admin.is_active);
            console.log('Email Verified:', admin.is_email_verified);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkAdmin();
