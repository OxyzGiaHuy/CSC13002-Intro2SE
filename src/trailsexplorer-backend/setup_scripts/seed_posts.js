const sequelize = require('../config/database');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

const POSTS = [
    {
        title: "Best trails near Da Lat?",
        content: "I'm planning a trip to Da Lat next month. Anyone has recommendations for intermediate hiking trails with good views? Looking for something around 10-15km.",
        content_type: 'QUESTION',
        like_count: 5,
        comment_count: 2
    },
    {
        title: "Fansipan Summit Success!",
        content: "Just came back from submitting Fansipan. The weather was absolutely perfect! We took the Tram Ton route and it was challenging but manageable.",
        content_type: 'TRIP_REPORT',
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // Photo
        like_count: 24,
        comment_count: 8
    },
    {
        title: "New Hiking Boots Review",
        content: "Just bought these new trail runners. Testing them out this weekend on the loop trail. Will post a full review soon!",
        content_type: 'PHOTO',
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        like_count: 12,
        comment_count: 3
    },
    {
        title: "Anyone joining the cleanup event?",
        content: "Regarding the trail cleanup event this Saturday in Son Tra Peninsula - let's coordinate carpooling from the city center.",
        content_type: 'TEXT',
        like_count: 8,
        comment_count: 15
    },
    {
        title: "Morning view from Langbiang",
        content: "Worth the 4am wake up call!",
        content_type: 'PHOTO',
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
        like_count: 45,
        comment_count: 7
    },
    {
        title: "Training for Ultra Trail",
        content: "Week 3 of training for VMM 42km. Today was a 20km long run with 1000m elevation gain. Legs are feeling it!",
        content_type: 'TEXT',
        like_count: 18,
        comment_count: 4
    }
];

async function seedPosts() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // Get users with username for mapping
        const users = await User.findAll({ attributes: ['user_id', 'username'] });
        if (users.length === 0) {
            console.log('❌ No users found.');
            return;
        }

        // Create a map of username -> user_id for easy lookup
        const userMap = {};
        users.forEach(u => {
            if (u.username) userMap[u.username] = u.user_id;
        });

        console.log('Truncating existing posts...');
        // Use truncate to reset IDs, cascade to remove related data (likes, comments)
        await CommunityPost.destroy({ where: {}, truncate: true, cascade: true });

        console.log('Seeding posts...');
        const postsWithUsers = [
            { ...POSTS[0], username: 'duong_nomad' }, // Question about Da Lat -> Duong Nomad
            { ...POSTS[1], username: 'alex_mountain' }, // Fansipan Summit -> Alex Mountain
            { ...POSTS[2], username: 'minh_trail' }, // Hiking Boots -> Minh Trail
            { ...POSTS[3], username: 'lan_peaks' }, // Cleanup event -> Lan Peaks
            { ...POSTS[4], username: 'sarah_trailblazer' }, // Langbiang view -> Sarah
            { ...POSTS[5], username: 'mike_treks' } // Ultra Training -> Mike Treks
        ];

        for (const post of postsWithUsers) {
            // Fallback to random if specific user not found (though they should exist now)
            let userId = userMap[post.username];
            if (!userId) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                userId = randomUser.user_id;
            }

            await CommunityPost.create({
                user_id: userId,
                title: post.title,
                content: post.content,
                content_type: post.content_type,
                media_urls: post.image ? [post.image] : [],
                like_count: post.like_count,
                comment_count: post.comment_count,
                is_published: true,
                is_approved: true, // Auto approve for seed
                visibility: 'PUBLIC'
            });
        }

        console.log(`✅ Successfully seeded ${POSTS.length} posts.`);

    } catch (error) {
        console.error('❌ Error seeding posts:', error);
    } finally {
        await sequelize.close();
    }
}

seedPosts();
