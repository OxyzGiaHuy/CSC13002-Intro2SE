const sequelize = require('../config/database');
const Review = require('../models/Review');
const CommunityPost = require('../models/CommunityPost');
const Challenge = require('../models/Challenge');

async function syncModels() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        console.log('Syncing Review model...');
        await Review.sync({ alter: true });
        console.log('✅ Review model synced.');

        console.log('Syncing Challenge model...');
        await Challenge.sync({ alter: true });
        console.log('✅ Challenge model synced.');

        console.log('Syncing CommunityPost model...');

        // Fix for ENUM casting error on Postgres/Neon
        // Fix for ENUM casting error on Postgres/Neon
        try {
            // 1. Create the ENUM type if it doesn't exist
            await sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE "public"."enum_community_posts_content_type" AS ENUM('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END $$;
            `);

            // 2. Drop any existing Check constraints on the column (incompatible with type change)
            await sequelize.query(`ALTER TABLE "community_posts" DROP CONSTRAINT IF EXISTS "community_posts_content_type_check";`);

            // 3. Sanitize existing data: invalid values -> 'TEXT'
            // We cast to text comparisons to avoid issues if column is already partial enum or weird state
            await sequelize.query(`
                UPDATE "community_posts"
                SET "content_type" = 'TEXT'
                WHERE "content_type"::text NOT IN ('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION');
            `);

            // 3. Drop the default value temporarily
            await sequelize.query(`ALTER TABLE "community_posts" ALTER COLUMN "content_type" DROP DEFAULT;`);

            // 4. Convert column to use the ENUM type with explicit casting
            await sequelize.query(`
                ALTER TABLE "community_posts" 
                ALTER COLUMN "content_type" TYPE "public"."enum_community_posts_content_type" 
                USING ("content_type"::text::"public"."enum_community_posts_content_type");
            `);

            // 5. Set the default value again (properly casted)
            await sequelize.query(`
                ALTER TABLE "community_posts" 
                ALTER COLUMN "content_type" SET DEFAULT 'TEXT'::"public"."enum_community_posts_content_type";
            `);

            console.log('✅ Manually fixed enum_community_posts_content_type');
        } catch (e) {
            console.log('Note: Manual ENUM fix skipped or failed (might already be correct):', e.message);
        }

        await CommunityPost.sync({ alter: true });
        console.log('✅ CommunityPost model synced.');

    } catch (err) {
        console.error('Error syncing models:', err);
    } finally {
        await sequelize.close();
    }
}

syncModels();
