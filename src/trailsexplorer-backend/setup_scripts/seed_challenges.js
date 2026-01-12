const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const Challenge = require('../models/Challenge');

const CHALLENGES_DATA = [
    { name: 'Early Bird 2026', description: 'Complete 5 hikes starting before 6 AM.', challenge_type: 'TRAIL_COUNT', target_value: 5, unit: 'hikes', start_date: '2026-01-01', end_date: '2026-03-31', reward_points: 500, image_url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80' },
    { name: 'Weekend Warrior', description: 'Hike 20km in a single weekend.', challenge_type: 'DISTANCE', target_value: 20, unit: 'km', start_date: '2026-02-01', end_date: '2026-02-28', reward_points: 300, image_url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80' },
    { name: 'Peak Bagger', description: 'Summit 3 mountains above 2000m.', challenge_type: 'TRAIL_COUNT', target_value: 3, unit: 'summits', start_date: '2026-01-01', end_date: '2026-12-31', reward_points: 1000, image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    { name: 'Forest Bather', description: 'Spend 10 hours on forest trails.', challenge_type: 'DURATION', target_value: 10, unit: 'hours', start_date: '2026-03-01', end_date: '2026-04-30', reward_points: 400, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
    { name: 'Trail Guardian', description: 'Participate in 2 trail cleanup events.', challenge_type: 'TRAIL_COUNT', target_value: 2, unit: 'events', start_date: '2026-04-01', end_date: '2026-06-30', reward_points: 600, image_url: 'https://images.unsplash.com/photo-1595278069441-2cf29f52d921?w=800&q=80' },
    { name: 'Night Owl', description: 'Complete a night hike (with a guide).', challenge_type: 'TRAIL_COUNT', target_value: 1, unit: 'hike', start_date: '2026-05-01', end_date: '2026-08-31', reward_points: 300, image_url: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80' },
    { name: 'Marathon Month', description: 'Hike a total of 42km in one month.', challenge_type: 'DISTANCE', target_value: 42, unit: 'km', start_date: '2026-06-01', end_date: '2026-06-30', reward_points: 800, image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
    { name: 'Social Hiker', description: 'Join 3 group hikes via the app.', challenge_type: 'TRAIL_COUNT', target_value: 3, unit: 'hikes', start_date: '2026-01-01', end_date: '2026-12-31', reward_points: 400, image_url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80' },
    { name: 'Gear Guru', description: 'Submit 5 detailed gear reviews.', challenge_type: 'TRAIL_COUNT', target_value: 5, unit: 'reviews', start_date: '2026-01-15', end_date: '2026-12-31', reward_points: 500, image_url: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=800&q=80' },
    { name: 'New Horizons', description: 'Visit 5 different trails you have never been to.', challenge_type: 'TRAIL_COUNT', target_value: 5, unit: 'trails', start_date: '2026-02-01', end_date: '2026-11-30', reward_points: 700, image_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80' }
];

async function seed() {
    try {
        console.log(`Connected to DB: ${sequelize.config.host} / ${sequelize.config.database}`);
        // await sequelize.authenticate(); // Model operations authenticate automatically

        console.log('Truncating existing challenges...');
        // Use truncate to clear table and reset IDs (optional restarted identity depending on DB)
        await Challenge.destroy({ where: {}, truncate: true, cascade: true });

        console.log('Seeding challenges via BulkCreate...');
        const challenges = await Challenge.bulkCreate(CHALLENGES_DATA, {
            updateOnDuplicate: ['description', 'challenge_type', 'target_value', 'unit', 'start_date', 'end_date', 'reward_points', 'image_url']
        });

        console.log(`Successfully seeded ${challenges.length} challenges.`);
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

seed();
