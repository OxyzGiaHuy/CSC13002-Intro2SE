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
        await client.query('TRUNCATE TABLE users, challenges, marketplace_items, user_groups, group_members, community_posts, trails, trail_reviews, system_configs RESTART IDENTITY CASCADE');

        console.log('🌱 Seeding example data (example-data.sql)...');
        const dataPath = path.join(__dirname, '../migrations/example-data.sql');
        const dataSql = fs.readFileSync(dataPath, 'utf8');
        await client.query(dataSql);

        // Reset sequences because example-data.sql uses explicit IDs
        console.log('🔄 Resetting sequences...');
        const tableMap = {
            'users': 'user_id',
            'challenges': 'challenge_id',
            'marketplace_items': 'item_id',
            'user_groups': 'group_id',
            'community_posts': 'post_id',
            'trails': 'trail_id',
            'user_favorites': 'favorite_id',
            'saved_plans': 'plan_id',
            'trail_images': 'image_id'
        };

        for (const [table, idColumn] of Object.entries(tableMap)) {
            try {
                // Determine sequence name. Default is usually table_id_seq or table_column_seq.
                // Using pg_get_serial_sequence is safest.
                await client.query(`SELECT setval(pg_get_serial_sequence('${table}', '${idColumn}'), COALESCE(MAX(${idColumn}), 0) + 1, false) FROM ${table};`);
            } catch (seqErr) {
                console.log(`⚠️ Could not reset sequence for ${table}: ${seqErr.message}`);
            }
        }

        console.log('🌱 Seeding community data (community_seed.sql)...');
        const communityPath = path.join(__dirname, '../migrations/community_seed.sql');
        if (fs.existsSync(communityPath)) {
            const communitySql = fs.readFileSync(communityPath, 'utf8');
            await client.query(communitySql);
        }

        // Task 5: Verify data
        console.log('🔍 Verifying data...');
        const trailCount = await client.query('SELECT COUNT(*) FROM trails');
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        const reviewCount = await client.query('SELECT COUNT(*) FROM trail_reviews');
        const challengeCount = await client.query('SELECT COUNT(*) FROM challenges');

        console.log(`✅ Trails: ${trailCount.rows[0].count}`);
        console.log(`✅ Users: ${userCount.rows[0].count}`);
        console.log(`✅ Reviews: ${reviewCount.rows[0].count}`);
        console.log(`✅ Challenges: ${challengeCount.rows[0].count}`);

        console.log('✅ Sequences updated successfully');

        console.log('✨ Database reset and seeded successfully!');
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        fs.writeFileSync(path.join(__dirname, 'seed_error.log'), JSON.stringify(err, null, 2));
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runSeed();
