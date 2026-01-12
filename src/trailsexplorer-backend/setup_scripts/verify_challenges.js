const sequelize = require('../config/database');

async function check() {
    try {
        console.log(`Connected to DB: ${sequelize.config.host} / ${sequelize.config.database}`);
        const [results, metadata] = await sequelize.query("SELECT * FROM challenges");
        console.log(`Found ${results.length} challenges:`);
        results.forEach(c => console.log(`- [${c.challenge_id}] ${c.name}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

check();
