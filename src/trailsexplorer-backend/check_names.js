const sequelize = require('./config/database');
const User = require('./models/User');

async function checkTopUsers() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const users = await User.findAll({
            where: { role: 'USER' },
            order: [['total_distance_km', 'DESC']],
            limit: 5,
            attributes: ['id', 'full_name', 'username', 'total_distance_km']
        });

        console.log('Top 5 Trekkers:');
        users.forEach(u => {
            console.log(`ID: ${u.id}, FullName: "${u.full_name}", Username: "${u.username}", Km: ${u.total_distance_km}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkTopUsers();
