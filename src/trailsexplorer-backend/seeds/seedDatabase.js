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

async function runSeed() {
    const client = await pool.connect();
    try {
        console.log('🔗 Connecting to database...');

        console.log('🧹 Cleaning database (DROP SCHEMA public)...');
        await client.query('DROP SCHEMA IF EXISTS public CASCADE');
        await client.query('CREATE SCHEMA public');

        console.log('🏗️  Running Schema migrations (schema.sql)...');
        const schemaPath = path.join(__dirname, '../migrations/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);

        console.log('🧹 Truncating tables just in case...');
        await client.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

        console.log('🌱 Seeding example data (example-data.sql)...');
        const dataPath = path.join(__dirname, '../migrations/example-data.sql');
        const dataSql = fs.readFileSync(dataPath, 'utf8');
        await client.query(dataSql);

        // Task 5: Verify data
        console.log('🔍 Verifying data...');
        const trailCount = await client.query('SELECT COUNT(*) FROM trails');
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        const reviewCount = await client.query('SELECT COUNT(*) FROM trail_reviews');

        console.log(`✅ Trails: ${trailCount.rows[0].count}`);
        console.log(`✅ Users: ${userCount.rows[0].count}`);
        console.log(`✅ Reviews: ${reviewCount.rows[0].count}`);

        console.log('✨ Database reset and seeded successfully!');
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runSeed();
