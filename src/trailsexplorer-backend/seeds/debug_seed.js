
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

async function runDebug() {
    const client = await pool.connect();
    try {
        console.log('Running example-data.sql...');
        const sqlPath = path.join(__dirname, '../migrations/example-data.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        await client.query(sql);
        console.log('Success!');
    } catch (err) {
        const errorInfo = `
Message: ${err.message}
Detail: ${err.detail}
Hint: ${err.hint}
Position: ${err.position}
Context: ${err.where}
        `;
        console.error(errorInfo);
        fs.writeFileSync('debug_error_full.txt', errorInfo);
    } finally {
        client.release();
        await pool.end();
    }
}

runDebug();
