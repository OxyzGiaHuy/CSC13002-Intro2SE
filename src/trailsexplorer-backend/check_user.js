const User = require('./models/User');
const sequelize = require('./config/database');

async function checkUser() {
    try {
        await sequelize.authenticate();
        const user = await User.findByPk(5);
        if (user) {
            console.log("✅ User 5 found:", user.toJSON());
        } else {
            console.log("❌ User 5 NOT found!");
        }

        const admin = await User.findOne({ where: { email: 'admin@trailsexplorer.com' } });
        console.log("ℹ️ Admin User:", admin ? admin.toJSON() : "Not Found");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await sequelize.close();
    }
}

checkUser();
