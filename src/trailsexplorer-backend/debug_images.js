const sequelize = require('./config/database');
sequelize.options.logging = false; // Disable logging
const Trail = require('./models/Trail');
const { QueryTypes } = require('sequelize');

async function debugImages() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        // 1. Check raw table counts
        const [results] = await sequelize.query("SELECT count(*) FROM trail_images");
        console.log('Total rows in trail_images:', results[0].count);

        if (results[0].count == 0) {
            console.log('❌ trail_images table is empty! You need to run the seed script.');
            return;
        }

        // 2. Check sample data
        const sampleImages = await sequelize.query("SELECT * FROM trail_images LIMIT 3", { type: QueryTypes.SELECT });
        console.log('Sample trail_images:', sampleImages);

        // 3. Simulate the logic in routes/trails.js
        const trails = await Trail.findAll({ limit: 5 });
        const trailIds = trails.map(t => t.id); // Note: verify if it is .id or .trail_id
        console.log('Trail IDs:', trailIds);

        if (trailIds.length > 0) {
            const images = await sequelize.query(
                `SELECT trail_id, image_url FROM trail_images WHERE trail_id IN (${trailIds.join(',')}) AND is_featured = true`,
                { type: QueryTypes.SELECT }
            );
            console.log('Images found for these trails:', images);

            const imageMap = {};
            images.forEach(i => { imageMap[i.trail_id] = i.image_url; });

            const data = trails.map(t => {
                const plain = t.get({ plain: true });
                return {
                    id: plain.id || plain.trail_id,
                    name: plain.name,
                    image_url_attached: imageMap[plain.id || plain.trail_id] || null
                };
            });
            console.log('Final Data Structure (Sample):', data);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

debugImages();
