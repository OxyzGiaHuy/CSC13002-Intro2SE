const sequelize = require('./config/database');
const fs = require('fs');

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug_error.log', msg + '\n', 'utf8');
}

async function debug() {
    try {
        fs.writeFileSync('debug_error.log', 'Starting debug...\n', 'utf8');
        await sequelize.authenticate();
        log('Connected.');

        // 1. Check current column info
        try {
            const [results] = await sequelize.query(`
                SELECT column_name, data_type, udt_name, column_default 
                FROM information_schema.columns 
                WHERE table_name = 'community_posts' AND column_name = 'content_type';
            `);
            log('Current Column State: ' + JSON.stringify(results, null, 2));

            const [values] = await sequelize.query(`
                SELECT DISTINCT content_type FROM "community_posts";
            `);
            log('Distinct Values: ' + JSON.stringify(values, null, 2));

        } catch (e) { log('Error checking columns: ' + e.message); }

        // 2. Try the fix steps one by one
        log('Step 1: Create Type');
        try {
            await sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE "public"."enum_community_posts_content_type" AS ENUM('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            `);
            log('Step 1: OK');
        } catch (e) {
            log('Step 1 Failed: ' + e.message);
        }

        log('Step 2: Drop Default');
        try {
            await sequelize.query(`ALTER TABLE "community_posts" ALTER COLUMN "content_type" DROP DEFAULT;`);
            log('Step 2: OK');
        } catch (e) {
            log('Step 2 Failed: ' + e.message);
        }

        log('Step 3: Alter Type');
        try {
            await sequelize.query(`
                ALTER TABLE "community_posts" 
                ALTER COLUMN "content_type" TYPE "public"."enum_community_posts_content_type" 
                USING ("content_type"::text::"public"."enum_community_posts_content_type");
            `);
            log('Step 3: OK');
        } catch (e) {
            log('Step 3 Failed: ' + e.message);
            if (e.original) log('Original Error: ' + e.original.message);
            if (e.parent) log('Parent Error: ' + e.parent.message);
            log(JSON.stringify(e, null, 2));
        }

    } catch (err) {
        log('General Error: ' + err.message);
    } finally {
        await sequelize.close();
    }
}

debug();
