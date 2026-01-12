const { Sequelize } = require('sequelize');
const CommunityPost = require('./models/CommunityPost');
const sequelize = require('./config/database');

async function resetPendingStats() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        console.log('🧹 Resetting stats for PENDING posts...');

        const result = await CommunityPost.update(
            {
                like_count: 0,
                comment_count: 0,
                share_count: 0
            },
            {
                where: {
                    is_approved: false
                }
            }
        );

        console.log(`✅ Successfully updated ${result[0]} pending posts.`);
        console.log('Stats (likes, comments, shares) have been reset to 0.');

    } catch (error) {
        console.error('❌ Error resetting stats:', error);
    } finally {
        await sequelize.close();
    }
}

resetPendingStats();
