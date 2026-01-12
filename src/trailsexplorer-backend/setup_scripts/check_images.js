const sequelize = require('../config/database');
const Trail = require('../models/Trail');
const TrailImage = require('../models/TrailImage');

async function listTrailImages() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const trails = await Trail.findAll({
            include: [{
                model: TrailImage,
                as: 'images'
            }],
            order: [['trail_id', 'ASC']]
        });

        const fs = require('fs');
        const output = trails.map(t => ({
            id: t.trail_id,
            name: t.name,
            images: t.images.map(i => i.image_url)
        }));

        fs.writeFileSync('trails_data.json', JSON.stringify(output, null, 2), 'utf8');
        console.log('Saved to trails_data.json');

    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

listTrailImages();
