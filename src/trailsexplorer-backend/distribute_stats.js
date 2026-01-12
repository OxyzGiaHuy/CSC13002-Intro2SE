const sequelize = require('./config/database');
const User = require('./models/User');

async function distributeUserStats() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const users = await User.findAll({ where: { role: 'USER' } });
        console.log(`Found ${users.length} users. Updating stats...`);

        let countUpdates = 0;

        for (const user of users) {
            // Randomly assign to a bucket
            const rand = Math.random();
            let km = 0;

            if (rand < 0.4) {
                // 40% keep low (0-100)
                km = Math.floor(Math.random() * 100);
            } else if (rand < 0.7) {
                // 30% mid (100-300)
                km = Math.floor(Math.random() * 200) + 100;
            } else if (rand < 0.9) {
                // 20% high (300-500)
                km = Math.floor(Math.random() * 200) + 300;
            } else {
                // 10% elite (500+)
                km = Math.floor(Math.random() * 500) + 500;
            }

            // Also update altitude roughly correlated
            const altitude = km * (10 + Math.random() * 50);

            user.total_distance_km = km;
            user.total_elevation_gain = altitude;
            user.total_trips_completed = Math.floor(km / 10) + 1; // Approx 10km per trip

            await user.save();
            countUpdates++;
        }

        console.log(`Updated stats for ${countUpdates} users.`);
    } catch (error) {
        console.error('Error updating usage stats:', error);
    } finally {
        await sequelize.close();
    }
}

distributeUserStats();
