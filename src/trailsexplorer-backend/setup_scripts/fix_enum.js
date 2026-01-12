const sequelize = require('./config/database');
const fs = require('fs');

function log(msg) {
    console.log(msg);
    fs.appendFileSync('fix_result.log', msg + '\n', 'utf8');
}

async function fix() {
    try {
        fs.writeFileSync('fix_result.log', 'Starting fix...\n', 'utf8');
        await sequelize.authenticate();
        log('Connected.');

        // 1. Create Type
        log('Creating Type...');
        try {
            await sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE "public"."enum_community_posts_content_type" AS ENUM('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            `);
            log('Type Created (or existed).');
        } catch (e) { log('Error Creating Type: ' + e.message); }

        // 2. Update Values
        log('Updating Values...');
        try {
            await sequelize.query(`
                UPDATE "community_posts"
                SET "content_type" = 'TEXT'
                WHERE "content_type" IS NULL 
                   OR "content_type"::text NOT IN ('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION');
            `);
            log('Values Updated.');
        } catch (e) { log('Error Updating Values: ' + e.message); }

        // 3. Drop Default
        log('Dropping Default...');
        try {
            await sequelize.query(`ALTER TABLE "community_posts" ALTER COLUMN "content_type" DROP DEFAULT;`);
            log('Default Dropped.');
        } catch (e) { log('Error Dropping Default: ' + e.message); }

        // 4. Alter Type
        log('Altering Type...');
        try {
            await sequelize.query(`
                ALTER TABLE "community_posts" 
                ALTER COLUMN "content_type" TYPE "public"."enum_community_posts_content_type" 
                USING ("content_type"::text::"public"."enum_community_posts_content_type");
            `);
            log('Type Altered.');
        } catch (e) {
            log('Error Altering Type: ' + e.message);
            log('Full Error: ' + JSON.stringify(e, null, 2));
        }

        // 5. Restore Default
        log('Restoring Default...');
        try {
            await sequelize.query(`
                ALTER TABLE "community_posts" 
                ALTER COLUMN "content_type" SET DEFAULT 'TEXT'::"public"."enum_community_posts_content_type";
            `);
            log('Default Restored.');
        } catch (e) { log('Error Restoring Default: ' + e.message); }

    } catch (err) {
        log('Fatal Error: ' + err.message);
    } finally {
        await sequelize.close();
    }
}

fix();
