const sequelize = require('../config/database');
const Trail = require('../models/Trail');
const TrailImage = require('../models/TrailImage');

const englishTrails = [
    {
        name: 'Fansipan Summit',
        location: 'Sapa, Lao Cai',
        region: 'Northern Vietnam',
        difficulty: 'HARD',
        imageUrl: 'https://images.unsplash.com/photo-1733821793652-e650876d9a7a?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Known as the "Roof of Indochina," Fansipan stands tall at 3,143 meters. A challenging trek through lush rainforests and bamboo groves, offering breathtaking panoramic views of the cloud-covered peaks.'
    },
    {
        name: 'Da Lat Pine Forest',
        location: 'Da Lat, Lam Dong',
        region: 'Central Highlands',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A serene hike through the misty pine forests of Da Lat. Enjoy the cool air, scenic lakes, and the peaceful atmosphere of the highlands known as the "City of Eternal Spring".'
    },
    {
        name: 'Cuc Phuong National Park',
        location: 'Ninh Binh',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1713429647867-7c8c0cc369fb?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Vietnam\'s oldest national park features dense lush tropical rainforests, ancient trees, and diverse wildlife. The trek offers a chance to see langurs and seasonal butterfly flocks.'
    },
    {
        name: 'Bach Ma National Park',
        location: 'Thua Thien Hue',
        region: 'Central Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1523224949444-170258978eef?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Discover spectacular waterfalls like Do Quyen and diverse flora in this biodiverse park. The summit offers commanding views of the coast, lagoons, and mountains.'
    },
    {
        name: 'Cat Ba National Park',
        location: 'Cat Ba, Hai Phong',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1725701191382-ff47fc9f90c4?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Hike through limestone karsts and tropical jungles on Cat Ba Island. The trail to Ngu Lam peak offers sweeping views of the island and Halong Bay.'
    },
    {
        name: 'Ninh Thuan Coastal Trail',
        location: 'Ninh Thuan',
        region: 'South Central Coast',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1524195958835-70f542b1924b?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A unique trek through the semi-arid landscape of Nui Chua, featuring rocky terrain, dry forests, and pristine beaches with crystal clear waters.'
    },
    {
        name: 'Pu Luong Nature Reserve',
        location: 'Thanh Hoa',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1695289566332-08eb1e223b6e?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Wander through stunning terraced rice fields and limestone ridges. Visit traditional Thai villages and enjoy the tranquil beauty of the countryside.'
    },
    {
        name: 'Ta Nang - Phan Dung',
        location: 'Lam Dong - Binh Thuan',
        region: 'South Central Coast',
        difficulty: 'HARD',
        imageUrl: 'https://images.unsplash.com/photo-1565693235245-37dc4d88a60e?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'The most beautiful trekking route in Vietnam, crossing grassy hills and pine forests, transitioning from highlands to coastal plains.'
    },
    {
        name: 'Hai Van Pass',
        location: 'Da Nang - Hue',
        region: 'Central Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1663856449506-a009e27878a9?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Trek along the "Ocean Cloud Pass" with dramatic coastal views. Explore historic bunkers and enjoy the winding roads surrounded by lush jungle and sea.'
    },
    {
        name: 'Ha Long Bay Viewpoint',
        location: 'Quang Ninh',
        region: 'Northern Vietnam',
        difficulty: 'EASY',
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A gentle hike offering iconic views of the limestone pillars rising from the emerald waters of Ha Long Bay, a UNESCO World Heritage site.'
    },
    {
        name: 'Lang Biang Peak',
        location: 'Da Lat, Lam Dong',
        region: 'Central Highlands',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Conquer the roof of Dalat. The trail passes through pine forests and jungle to reach the peak, offering magnificent views of the Golden Valley and Silver Stream.'
    },
    {
        name: 'O Quy Ho Pass',
        location: 'Lai Chau',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1761218963784-39ef992a6da3?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Trek near one of the four great mountain passes of the Northwest. Enjoy dramatic mountain scenery, deep valleys, and the sea of clouds.'
    },
    {
        name: 'Tra Su Cajuput Forest',
        location: 'An Giang',
        region: 'Mekong Delta',
        difficulty: 'EASY',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Explore the flooded cajuput forest of the Mekong Delta. A peaceful walk on raised bamboo bridges surrounded by green duckweed and diverse birdlife.'
    },
    {
        name: 'Ba Den Mountain',
        location: 'Tay Ninh',
        region: 'Southern Vietnam',
        difficulty: 'HARD',
        imageUrl: 'https://images.unsplash.com/photo-1695442443973-40067c5f3d7a?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'The highest peak in the South. A challenging scramble over boulders leads to the summit, offering panoramic views of the plains and reservoirs.'
    },
    {
        name: 'Bai Tu Long Bay',
        location: 'Quang Ninh',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A pristine alternative to Ha Long Bay. Hike on islands with untouched beaches and limestone karsts, enjoying solitude and natural beauty.'
    },
    {
        name: 'Bidoup Nui Ba',
        location: 'Lam Dong',
        region: 'Central Highlands',
        difficulty: 'HARD',
        imageUrl: 'https://images.unsplash.com/photo-1686242228254-ca3bedc1db57?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A journey through time in the ancient mossy forests. Encounter rare broad-leaf pines and diverse orchids in this rich highland ecosystem.'
    },
    {
        name: 'Tay Con Linh',
        location: 'Ha Giang',
        region: 'Northern Vietnam',
        difficulty: 'HARD',
        imageUrl: 'https://images.unsplash.com/photo-1562920618-c427d9252d7a?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'The roof of the Northeast. A tough trek through ancient tea forests and bamboo jungles to reach the summit covered in fog.'
    },
    {
        name: 'Quan Ba Heaven Gate',
        location: 'Ha Giang',
        region: 'Northern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1686755660203-55781dbc2f24?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Hike up to the Heaven Gate for a stunning view of the Twin Mountains and the Tam Son town nestled in the valley below.'
    },
    {
        name: 'Ba Be Lake',
        location: 'Bac Kan',
        region: 'Northern Vietnam',
        difficulty: 'EASY',
        imageUrl: 'https://images.unsplash.com/photo-1595634840658-26e8575ded94?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'Trek around Vietnam\'s largest natural freshwater lake. Experience the tranquil waters, caves, and ethnic minority villages in the national park.'
    },
    {
        name: 'Dinh Mountain',
        location: 'Ba Ria - Vung Tau',
        region: 'Southern Vietnam',
        difficulty: 'MODERATE',
        imageUrl: 'https://images.unsplash.com/photo-1462688681110-15bc88b1497c?q=80&w=1200&h=800&auto=format&fit=crop',
        description: 'A popular hiking spot near Vung Tau. The trail leads to Buddhist pagodas, cool streams like Suoi Da/Suoi Tien, and offers ocean views.'
    }
];

async function translateTrails() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // Get all trails
        const trails = await Trail.findAll({ order: [['trail_id', 'ASC']] });

        console.log(`🔄 Translating and Updating Images for ${trails.length} trails...`);

        // Update each trail with English data if available
        for (let i = 0; i < trails.length; i++) {
            if (i < englishTrails.length) {
                const en = englishTrails[i];
                const trail = trails[i];

                console.log(`[ID ${trail.trail_id}] Updating to: ${en.name}`);

                // Update Trail Info
                trail.name = en.name;
                trail.location_province = en.location;
                if (en.region) trail.location_region = en.region;
                if (en.description) trail.description = en.description;
                if (en.difficulty) trail.difficulty = en.difficulty;

                await trail.save();

                // Update Image
                if (en.imageUrl) {
                    let image = await TrailImage.findOne({ where: { trail_id: trail.trail_id } });
                    if (image) {
                        image.image_url = en.imageUrl;
                        await image.save();
                    } else {
                        await TrailImage.create({ trail_id: trail.trail_id, image_url: en.imageUrl });
                    }
                }
            }
        }

        console.log('✅ Translation and Image Update complete.');

    } catch (error) {
        console.error('❌ Error updating:', error);
    } finally {
        await sequelize.close();
    }
}

translateTrails();
