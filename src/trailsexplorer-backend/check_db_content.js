const sequelize = require('./config/database');
const User = require('./models/User');
const Trail = require('./models/Trail');

async function checkContent() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const userCount = await User.count();
        const trailCount = await Trail.count();

        console.log('------------------------------------------------');
        console.log(`📊 USERS COUNT: ${userCount}`);
        console.log(`🏔️ TRAILS COUNT: ${trailCount}`);
        console.log('------------------------------------------------');

        if (trailCount > 0) {
            const trails = await Trail.findAll({ limit: 3, attributes: ['name', 'difficulty'] });
            console.log('Top 3 Trails:', JSON.stringify(trails, null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkContent();
