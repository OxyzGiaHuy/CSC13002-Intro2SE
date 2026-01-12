const sequelize = require('./config/database');
const User = require('./models/User');

// Simple random generator since we don't have faker
const getRandomName = () => {
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Avery', 'Parker', 'Quinn', 'Sam', 'Chris', 'Pat', 'Drew', 'Reese'];
    return names[Math.floor(Math.random() * names.length)];
};

function getRandomDate() {
    const start = new Date();
    start.setDate(start.getDate() - 7); // Last 7 days
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedUsers() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // Verify if we should clean up old data? 
        // User requested "Update list user according to 50 mock data". 
        // Ideally we wipe non-admin users first to keep it clean (exact 50 + admins).
        // But foreign keys might block. Let's just create 50 new ones.

        const usersToCreate = [];
        const targetCount = 50;

        console.log(`Preparing ${targetCount} mock users...`);

        for (let i = 0; i < targetCount; i++) {
            const name = getRandomName();
            const suffix = Math.floor(Math.random() * 10000);
            const username = `${name.toLowerCase()}_${suffix}`;

            usersToCreate.push({
                username: username,
                email: `${username}@example.com`,
                password: 'password123', // Hardcoded for dev
                full_name: `${name} ${suffix}`,
                role: 'USER',
                is_active: true, // All active for "Active Trekkers" count
                is_email_verified: true,
                created_at: getRandomDate(), // Random date in last 7 days
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
            });
        }

        let count = 0;
        for (const userData of usersToCreate) {
            const [user, created] = await User.findOrCreate({
                where: { email: userData.email },
                defaults: userData
            });
            if (created) count++;
        }

        console.log(`✅ Successfully seeded ${count} new users.`);

        const total = await User.count();
        console.log(`📊 Total Users in DB: ${total}`);

    } catch (error) {
        console.error('❌ Error seeding users:', error);
    } finally {
        await sequelize.close();
    }
}

seedUsers();
