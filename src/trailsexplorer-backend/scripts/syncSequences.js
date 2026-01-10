const sequelize = require('../config/database');

async function syncSequences() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const tables = [
            'users',
            'trails',
            'community_posts',
            'marketplace_items',
            'user_groups', // or 'groups' depending on table name in DB
            'challenges',
            'reviews'
        ];

        for (const table of tables) {
            try {
                // Get the Primary Key column name (usually table_id or just id)
                // Adjust based on your schema.
                let pk = 'id';
                if (table === 'users') pk = 'user_id';
                if (table === 'trails') pk = 'trail_id';
                if (table === 'community_posts') pk = 'post_id';
                if (table === 'marketplace_items') pk = 'item_id';
                if (table === 'user_groups') pk = 'group_id';
                if (table === 'challenges') pk = 'challenge_id';
                if (table === 'reviews') pk = 'review_id';

                // This query resets the sequence to MAX(id) + 1
                const query = `SELECT setval(pg_get_serial_sequence('${table}', '${pk}'), COALESCE(MAX(${pk}), 1) + 1, false) FROM ${table};`;
                await sequelize.query(query);
                console.log(`Synced sequence for ${table}`);
            } catch (err) {
                console.log(`Skipping ${table} (maybe not exists or no sequence):`, err.message);
            }
        }

        console.log('All sequences synced.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing sequences:', error);
        process.exit(1);
    }
}

syncSequences();
