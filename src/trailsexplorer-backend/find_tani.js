const sequelize = require('./config/database');
const Group = require('./models/Group');

async function checkGroups() {
    try {
        await sequelize.authenticate();
        const groups = await Group.findAll({
            where: { name: 'TaNi Trip' }
        });
        console.log('Found groups:', JSON.stringify(groups, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

checkGroups();
