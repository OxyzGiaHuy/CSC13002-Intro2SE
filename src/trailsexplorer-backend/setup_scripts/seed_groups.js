const sequelize = require('../config/database');
const Group = require('../models/Group');
const User = require('../models/User');

const groupNames = [
    "Sapa Trekkers", "Hanoi Hiking Club", "Weekend Warriors", "Mountain Lovers",
    "Vietnam Trail Runners", "Nature Seekers", "Photography & Hike",
    "Solo Travelers Meetup", "Family Adventures", "Student Trekking Assoc", "Sunrise Chasers",
    "Forest Bathing Group", "Peak Baggers", "Trail Cleanup Crew"
];

const groupImages = [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80", // Forest/Nature image
    "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=400&q=80",
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=400&q=80",
    "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&q=80",
    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&q=80"
];

function getRandomDate() {
    const start = new Date();
    start.setDate(start.getDate() - 7); // Last 7 days
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedGroups() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        console.log('Truncating existing groups...');
        await Group.destroy({ where: {}, truncate: true, cascade: true });

        // Get all users to assign as owners
        const users = await User.findAll({ attributes: ['user_id'] });
        if (users.length === 0) {
            console.log('❌ No users found. Run seed_users.js first.');
            return;
        }

        // We want exactly 15 groups as requested.
        const targetGroups = 15;
        console.log(`🔄 Seeding ${targetGroups} Groups...`);

        // If list is shorter than target, reuse or generate generic names
        for (let i = 0; i < targetGroups; i++) {
            let name = groupNames[i];
            if (!name) name = `Hiking Group ${i + 1}`;

            const owner = users[Math.floor(Math.random() * users.length)];

            // Generate random creation date in last 7 days
            const createdDate = getRandomDate();

            const randomImage = groupImages[i % groupImages.length];

            await Group.create({
                name: name,
                description: `A private or public community for those who love ${name}.`,
                created_by: owner.user_id,
                group_type: Math.random() > 0.3 ? 'PUBLIC' : 'PRIVATE',
                avatar_url: randomImage,
                created_at: createdDate
            });
        }

        const total = await Group.count();
        console.log(`✅ Created groups. Total Groups in DB: ${total}`);

    } catch (error) {
        console.error('❌ Error seeding groups:', error);
    } finally {
        await sequelize.close();
    }
}

seedGroups();
