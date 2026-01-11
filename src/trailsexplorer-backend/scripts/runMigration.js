const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, '../migrations/add_notifications.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration: add_notifications.sql...');
        await sequelize.query(sql);
        console.log('Migration successful!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
