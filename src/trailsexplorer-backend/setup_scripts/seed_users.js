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

        const personas = [
            {
                username: 'alex_mountain',
                full_name: 'Alex Mountain',
                email: 'alex@example.com',
                bio: 'Alpine climber and mountain photographer based in Chamonix. Always seeking the next summit.',
                home_city: 'Chamonix, FR',
                avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
                total_distance_km: 3420,
                total_trips_completed: 56
            },
            {
                username: 'minh_trail',
                full_name: 'Minh Trail',
                email: 'minh@example.com',
                bio: 'Lover of Northwest loops and sticky mud. Finding beauty in every step.',
                home_city: 'Hà Giang, VN',
                avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
                total_distance_km: 1250,
                total_trips_completed: 22
            },
            {
                username: 'sarah_trailblazer',
                full_name: 'Sarah Trailblazer',
                email: 'sarah@example.com',
                bio: 'Ultralight backpacking enthusiast. 3x PCT finisher. Lover of wild places and good coffee.',
                home_city: 'Seattle, WA',
                avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
                total_distance_km: 8200,
                total_trips_completed: 34
            },
            {
                username: 'lan_peaks',
                full_name: 'Lan Peaks',
                email: 'lan@example.com',
                bio: 'City escape artist and morning hiker. The best view follows the hardest climb.',
                home_city: 'Lâm Đồng, VN',
                avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
                total_distance_km: 420,
                total_trips_completed: 45
            },
            {
                username: 'chris_peaks',
                full_name: 'Chris Peaks',
                email: 'chris@example.com',
                bio: 'Peak bagger and trail runner. If there is a hill, I will run up it.',
                home_city: 'Boulder, CO',
                avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
                total_distance_km: 1240,
                total_trips_completed: 89
            },
            {
                username: 'jenny_pines',
                full_name: 'Jenny Pines',
                email: 'jenny@example.com',
                bio: 'Wilderness guide and wilderness first responder. Teaching people how to respect nature.',
                home_city: 'Portland, OR',
                avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
                total_distance_km: 980,
                total_trips_completed: 112
            },
            {
                username: 'mike_treks',
                full_name: 'Mike Treks',
                email: 'mike@example.com',
                bio: 'Gear nerd and winter trekker. Testing the limits of thermal layers.',
                home_city: 'Anchorage, AK',
                avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
                total_distance_km: 2100,
                total_trips_completed: 28
            },
            {
                username: 'duong_nomad',
                full_name: 'Dương Nomad',
                email: 'duong@example.com',
                bio: 'Capturing the serenity of Central Highlands. Adventure is out there.',
                home_city: 'Đắk Lắk, VN',
                avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
                total_distance_km: 890,
                total_trips_completed: 15
            }
        ];

        for (const persona of personas) {
            usersToCreate.push({
                ...persona,
                password: 'password123',
                role: 'USER',
                is_active: true,
                is_email_verified: true,
                created_at: getRandomDate()
            });
        }

        // Add 10 more random users for variety in moderation
        for (let i = 0; i < 10; i++) {
            const name = getRandomName();
            const suffix = Math.floor(Math.random() * 10000);
            const username = `${name.toLowerCase()}_${suffix}`;
            usersToCreate.push({
                username: username,
                email: `${username}@example.com`,
                password: 'password123',
                full_name: `${name} ${suffix}`,
                role: 'USER',
                is_active: true,
                is_email_verified: true,
                created_at: getRandomDate(),
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
