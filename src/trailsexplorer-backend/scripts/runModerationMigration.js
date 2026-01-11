// Migration script to add moderation fields to database
const db = require('../config/db');

const addModerationFields = async () => {
    try {
        console.log('Starting migration: Adding moderation fields...');

        await db.query('BEGIN');

        // Add moderation fields to trail_reviews table
        console.log('Adding fields to trail_reviews table...');
        await db.query(`
            ALTER TABLE trail_reviews 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
            ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS moderated_by INTEGER REFERENCES users(user_id);
        `);

        // Add moderation fields to community_posts table
        console.log('Adding fields to community_posts table...');
        await db.query(`
            ALTER TABLE community_posts 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS reported_by_users JSONB DEFAULT '[]'::jsonb,
            ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS moderated_by INTEGER REFERENCES users(user_id);
        `);

        // Create indexes for better query performance
        console.log('Creating indexes...');
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_reviews_approval ON trail_reviews(is_approved, is_published);
        `);
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_posts_approval ON community_posts(is_approved, is_published);
        `);
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_posts_reports ON community_posts(report_count);
        `);

        // Set existing reviews and posts as approved for backward compatibility
        console.log('Setting existing content as approved...');
        const reviewsResult = await db.query(`
            UPDATE trail_reviews 
            SET is_approved = TRUE 
            WHERE is_approved IS NULL OR is_approved = FALSE;
        `);
        console.log(`Updated ${reviewsResult.rowCount} reviews to approved`);

        const postsResult = await db.query(`
            UPDATE community_posts 
            SET is_approved = TRUE 
            WHERE is_approved IS NULL OR is_approved = FALSE;
        `);
        console.log(`Updated ${postsResult.rowCount} posts to approved`);

        await db.query('COMMIT');

        console.log('\n✅ Migration completed successfully!');
        console.log('Moderation fields have been added to trail_reviews and community_posts tables.');
        console.log('\nPlease restart the backend server: pm2 restart trailsexplorer-api');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        try {
            await db.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Rollback error:', rollbackError.message);
        }
        process.exit(1);
    }
};

// Run migration
console.log('TrailsExplorer - Database Migration for Admin Moderation');
console.log('========================================================\n');
addModerationFields();
