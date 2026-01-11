const sequelize = require('../config/database');
const Challenge = require('../models/Challenge');

async function seedChallenges() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync(); // Ensure models are synced

        const challenges = [
            {
                name: 'Morning Runner',
                description: 'Run 5km every morning for a week.',
                target_value: 35.0,
                unit: 'km',
                challenge_type: 'DISTANCE',
                start_date: new Date(),
                end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
                created_by: 1 // Assuming user 1 exists
            },
            {
                name: 'Elevation King',
                description: 'Climb 1000m elevation gain total.',
                target_value: 1000,
                unit: 'm',
                challenge_type: 'ELEVATION',
                start_date: new Date(),
                end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
                created_by: 1
            },
            {
                name: 'Trail Explorer',
                description: 'Visit 5 different trails.',
                target_value: 5,
                unit: 'trails',
                challenge_type: 'TRAIL_COUNT',
                start_date: new Date(),
                end_date: new Date(new Date().setDate(new Date().getDate() + 14)),
                created_by: 1
            }
        ];

        for (const challenge of challenges) {
            await Challenge.create(challenge);
        }

        console.log('Challenges seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding challenges:', error);
        process.exit(1);
    }
}

seedChallenges();
