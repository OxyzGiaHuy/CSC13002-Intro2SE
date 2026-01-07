const sequelize = require('./config/database');

async function fixSequence() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Fix users table sequence
        // user_id is the column, users is the table.
        // Standard postgres sequence name: users_user_id_seq
        await sequelize.query(`SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users) + 1, 1), false);`);
        console.log('✅ Sequence users_user_id_seq fixed.');

        // Fix trails table sequence
        await sequelize.query(`SELECT setval('trails_trail_id_seq', COALESCE((SELECT MAX(trail_id) FROM trails) + 1, 1), false);`);
        console.log('✅ Sequence trails_trail_id_seq fixed.');

        // Fix community_posts table sequence
        await sequelize.query(`SELECT setval('community_posts_post_id_seq', COALESCE((SELECT MAX(post_id) FROM community_posts) + 1, 1), false);`);
        console.log('✅ Sequence community_posts_post_id_seq fixed.');

        // Fix trail_reviews table sequence
        await sequelize.query(`SELECT setval('trail_reviews_review_id_seq', COALESCE((SELECT MAX(review_id) FROM trail_reviews) + 1, 1), false);`);
        console.log('✅ Sequence trail_reviews_review_id_seq fixed.');

        // Fix user_favorites table sequence
        await sequelize.query(`SELECT setval('user_favorites_favorite_id_seq', COALESCE((SELECT MAX(favorite_id) FROM user_favorites) + 1, 1), false);`);
        console.log('✅ Sequence user_favorites_favorite_id_seq fixed.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing sequence:', err);
        process.exit(1);
    }
}

fixSequence();
