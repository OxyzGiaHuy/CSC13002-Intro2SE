const sequelize = require('./config/database');
const Review = require('./models/Review');
const CommunityPost = require('./models/CommunityPost');

async function syncModels() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        console.log('Syncing Review model...');
        await Review.sync({ alter: true });
        console.log('✅ Review model synced.');

        console.log('Syncing CommunityPost model...');
        await CommunityPost.sync({ alter: true });
        console.log('✅ CommunityPost model synced.');

    } catch (err) {
        console.error('Error syncing models:', err);
    } finally {
        await sequelize.close();
    }
}

syncModels();
