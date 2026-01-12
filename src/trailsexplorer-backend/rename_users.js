const sequelize = require('./config/database');
const User = require('./models/User');

async function renameTopUsers() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const users = await User.findAll({
            where: { role: 'USER' },
            order: [['total_distance_km', 'DESC']],
            limit: 5
        });

        const newNames = [
            'Nguyễn Văn Huy',
            'Trần Thị Mai',
            'Lê Hoàng Nam',
            'Phạm Minh Tuấn',
            'Hoàng Thu Trang'
        ];

        let i = 0;
        for (const user of users) {
            if (newNames[i]) {
                const oldName = user.full_name;
                user.full_name = newNames[i];
                user.username = newNames[i].toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 100);
                await user.save();
                console.log(`Renamed "${oldName}" to "${user.full_name}"`);
            }
            i++;
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

renameTopUsers();
