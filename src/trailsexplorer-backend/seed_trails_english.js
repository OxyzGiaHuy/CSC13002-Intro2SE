const sequelize = require('./config/database');
const Trail = require('./models/Trail');

const englishTrails = [
    { name: 'Fansipan Summit', location: 'Sapa, Lao Cai', difficulty: 'HARD' },
    { name: 'Cat Ba National Park', location: 'Cat Ba, Hai Phong', difficulty: 'MODERATE' },
    { name: 'Ta Nang - Phan Dung', location: 'Lam Dong - Binh Thuan', difficulty: 'HARD' },
    { name: 'Ba Vi National Park', location: 'Ba Vi, Hanoi', difficulty: 'EASY' },
    { name: 'Ham Lon Mountain', location: 'Soc Son, Hanoi', difficulty: 'MODERATE' },
    { name: 'Yen Tu Mountain', location: 'Quang Ninh', difficulty: 'MODERATE' },
    { name: 'Bach Ma National Park', location: 'Thua Thien Hue', difficulty: 'MODERATE' },
    { name: 'Lang Biang Peak', location: 'Da Lat, Lam Dong', difficulty: 'MODERATE' },
    { name: 'Bidoup Nui Ba', location: 'Lac Duong, Lam Dong', difficulty: 'HARD' },
    { name: 'Chua Chan Mountain', location: 'Dong Nai', difficulty: 'EASY' },
    { name: 'Ba Den Mountain', location: 'Tay Ninh', difficulty: 'HARD' },
    { name: 'Pusilung Peak', location: 'Lai Chau', difficulty: 'HARD' },
    { name: 'Putaleng Peak', location: 'Lai Chau', difficulty: 'HARD' },
    { name: 'Ky Quan San (Bach Moc Luong Tu)', location: 'Lao Cai - Lai Chau', difficulty: 'HARD' },
    { name: 'Ta Chi Nhu', location: 'Yen Bai', difficulty: 'HARD' },
    { name: 'Lung Cung Peak', location: 'Yen Bai', difficulty: 'MODERATE' },
    { name: 'Ta Xua Dinosaur Spine', location: 'Son La', difficulty: 'MODERATE' },
    { name: 'Pha Luong Peak', location: 'Moc Chau, Son La', difficulty: 'MODERATE' },
    { name: 'Hang En Cave', location: 'Quang Binh', difficulty: 'MODERATE' },
    { name: 'Son Doong Cave', location: 'Quang Binh', difficulty: 'HARD' }
];

async function translateTrails() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // Get all trails
        const trails = await Trail.findAll({ order: [['trail_id', 'ASC']] });

        console.log(`🔄 Translating ${trails.length} trails to English...`);

        // Update each trail with English data if available
        for (let i = 0; i < trails.length; i++) {
            if (i < englishTrails.length) {
                const en = englishTrails[i];
                const trail = trails[i];

                trail.name = en.name;
                trail.location_province = en.location;
                // Keep other fields but update language
                await trail.save();
                console.log(`   + Updated: ${en.name}`);
            }
        }

        console.log('✅ Translation complete.');

    } catch (error) {
        console.error('❌ Error translating:', error);
    } finally {
        await sequelize.close();
    }
}

translateTrails();
