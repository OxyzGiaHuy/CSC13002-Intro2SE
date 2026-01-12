const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected via Sequelize.');

        const sqlPath = path.join(__dirname, 'migrations', 'seed_challenges_v2.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running seed script...');
        await sequelize.query(sql);
        console.log('Seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();
