const sequelize = require('./config/database');
const Group = require('./models/Group');

async function deleteGroups() {
    try {
        await sequelize.authenticate();
        const deletedCount = await Group.destroy({
            where: {
                name: 'TaNi Trip'
            }
        });
        console.log(`Successfully deleted ${deletedCount} groups.`);
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

deleteGroups();
