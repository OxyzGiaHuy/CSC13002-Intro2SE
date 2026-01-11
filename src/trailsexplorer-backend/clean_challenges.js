const sequelize = require('./config/database');
const { Op } = require('sequelize');
const Challenge = require('./models/Challenge');

async function clean() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Delete challenges with Vietnamese names (the old ones)
        const count = await Challenge.destroy({
            where: {
                name: {
                    [Op.or]: [
                        'Thử thách 50km Tháng 1',
                        'Chinh phục 3 đỉnh núi mới',
                        'Tích lũy 50km trekking'
                    ]
                }
            }
        });

        console.log(`Deleted ${count} old challenges.`);
    } catch (err) {
        console.error('Clean failed:', err);
    } finally {
        await sequelize.close();
    }
}

clean();
