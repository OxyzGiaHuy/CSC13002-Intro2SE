const sequelize = require('./config/database');
const Group = require('./models/Group');
const User = require('./models/User');

const groupNames = [
    "Sapa Trekkers", "Hanoi Hiking Club", "Weekend Warriors", "Mountain Lovers",
    "Vietnam Trail Runners", "Da Lat Explorers", "Nature Seekers", "Photography & Hike",
    "Solo Travelers Meetup", "Family Adventures", "Student Trekking Assoc", "Sunrise Chasers",
    "Forest Bathing Group", "Peak Baggers", "Trail Cleanup Crew"
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

            await Group.create({
                name: name,
                description: `A private or public community for those who love ${name}.`,
                created_by: owner.user_id,
                group_type: Math.random() > 0.3 ? 'PUBLIC' : 'PRIVATE',
                avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
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
