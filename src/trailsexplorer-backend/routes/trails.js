const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Trail = require('../models/Trail');
const Review = require('../models/Review');
const User = require('../models/User');
const TrailImage = require('../models/TrailImage');
const authenticateToken = require('../middleware/authMiddleware');

const sequelize = require('../config/database');

// 1. GET /api/trails: List trails (Pagination, Filtering)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, difficulty, location } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (difficulty) where.difficulty = difficulty.toUpperCase();
        if (location) where.location_province = { [Op.iLike]: `%${location}%` };

        const { count, rows } = await Trail.findAndCountAll({
            where,
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT CAST(AVG(overall_rating) AS DECIMAL(3,1))
                            FROM trail_reviews AS review
                            WHERE
                                review.trail_id = "Trail"."trail_id"
                        )`),
                        'avg_rating'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM trail_reviews AS review
                            WHERE
                                review.trail_id = "Trail"."trail_id"
                        )`),
                        'num_reviews'
                    ]
                ]
            },
            include: [{
                model: TrailImage,
                as: 'images',
                attributes: ['image_url'],
                required: false
            }],
            distinct: true, // Specific for findAndCountAll with include
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        // Flatten image_url for frontend convenience
        const data = rows.map(trail => {
            const t = trail.toJSON();
            // Pick first image as main image
            t.image_url = t.images && t.images.length > 0 ? t.images[0].image_url : null;
            // Ensure rating is a number
            t.avg_rating = parseFloat(t.avg_rating) || 0;
            t.num_reviews = parseInt(t.num_reviews) || 0;
            return t;
        });

        res.json({
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            data: data
        });
    } catch (err) {
        // console.error(err); // Consider logging
        res.status(500).json({ error: err.message });
    }
});

// 4. GET /api/trails/search?q=keyword
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Missing search keyword" });

        const trails = await Trail.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${q}%` } },
                    { location_province: { [Op.iLike]: `%${q}%` } },
                    { location_region: { [Op.iLike]: `%${q}%` } }
                ]
            },
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT CAST(AVG(overall_rating) AS DECIMAL(3,1))
                            FROM trail_reviews AS review
                            WHERE
                                review.trail_id = "Trail"."trail_id"
                        )`),
                        'avg_rating'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM trail_reviews AS review
                            WHERE
                                review.trail_id = "Trail"."trail_id"
                        )`),
                        'num_reviews'
                    ]
                ]
            },
            include: [{
                model: TrailImage,
                as: 'images',
                attributes: ['image_url'],
                required: false
            }],
            limit: 20
        });

        const data = trails.map(trail => {
            const t = trail.toJSON();
            t.image_url = t.images && t.images.length > 0 ? t.images[0].image_url : null;
            t.avg_rating = parseFloat(t.avg_rating) || 0;
            t.num_reviews = parseInt(t.num_reviews) || 0;
            return t;
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET /api/trails/:id: Detail + Reviews
router.get('/:id', async (req, res) => {
    try {
        const trail = await Trail.findByPk(req.params.id, {
            attributes: {
                include: [
                    // 1. Rating & Reviews count
                    [sequelize.literal(`(SELECT CAST(AVG(overall_rating) AS DECIMAL(3,1)) FROM trail_reviews AS review WHERE review.trail_id = "Trail"."trail_id")`), 'avg_rating'],
                    [sequelize.literal(`(SELECT COUNT(*) FROM trail_reviews AS review WHERE review.trail_id = "Trail"."trail_id")`), 'num_reviews'],
                    
                    // 2. TÍNH TOÁN TỌA ĐỘ TRỰC TIẾP BẰNG SQL (Đặt tên biến rõ ràng)
                    [sequelize.fn('ST_Y', sequelize.cast(sequelize.col('start_point'), 'geometry')), 'geo_start_lat'], 
                    [sequelize.fn('ST_X', sequelize.cast(sequelize.col('start_point'), 'geometry')), 'geo_start_lng'],
                    [sequelize.fn('ST_Y', sequelize.cast(sequelize.col('end_point'), 'geometry')), 'geo_end_lat'],
                    [sequelize.fn('ST_X', sequelize.cast(sequelize.col('end_point'), 'geometry')), 'geo_end_lng']
                ]
            },
            include: [
                {
                    model: Review,
                    where: { is_approved: true, is_published: true },
                    required: false,
                    include: [{ model: User, attributes: ['username', 'avatar_url'] }],
                    order: [['created_at', 'DESC']],
                    limit: 5
                },
                { model: TrailImage, as: 'images', required: false }
            ]
        });

        if (!trail) return res.status(404).json({ message: "Trail not found" });

        // --- BẮT ĐẦU XỬ LÝ DỮ LIỆU THỦ CÔNG ---
        
        // Lấy dữ liệu thô (Raw) từ Sequelize. 
        // dataValues chứa tất cả mọi thứ: từ column thật đến column tính toán (geo_start_lat...)
        const raw = trail.dataValues;

        // Hàm helper để ép kiểu số an toàn
        const parseCoord = (val) => {
            if (val === null || val === undefined) return null;
            const num = parseFloat(val);
            return isNaN(num) ? null : num;
        };

        // Tạo object response thủ công để đảm bảo không bị toJSON() lọc mất
        const responseData = {
            ...trail.toJSON(), // Copy các trường cơ bản
            
            // Ghi đè tọa độ bằng giá trị lấy từ SQL Alias
            start_lat: parseCoord(raw.geo_start_lat),
            start_lng: parseCoord(raw.geo_start_lng),
            end_lat:   parseCoord(raw.geo_end_lat),
            end_lng:   parseCoord(raw.geo_end_lng),
            
            // Format lại các trường khác
            image_url: raw.images && raw.images.length > 0 ? raw.images[0].image_url : null,
            avg_rating: parseFloat(raw.avg_rating) || 0,
            num_reviews: parseInt(raw.num_reviews) || 0
        };

        // --- DEBUG LOG SERVER ---
        // Xem Server log (Terminal chạy node) để biết kết quả
        console.log(`[DEBUG API] Trail ID: ${req.params.id}`);
        console.log(`- Raw SQL values: Lat=${raw.geo_start_lat}, Lng=${raw.geo_start_lng}`);
        console.log(`- Final Response: Lat=${responseData.start_lat}, Lng=${responseData.start_lng}`);

        res.json(responseData);

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. POST /api/trails/:id/reviews: Add Review
router.post('/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const { overall_rating, content, difficulty_rating } = req.body;
        const trail_id = req.params.id;
        const user_id = req.user.id;

        const newReview = await Review.create({
            trail_id,
            user_id,
            overall_rating,
            difficulty_rating, // Optional based on extended schema
            content,
            visited_date: new Date()
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE /api/trails/:id/reviews/:reviewId
router.delete('/:id/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findByPk(reviewId);

        if (!review) return res.status(404).json({ message: "Review not found" });

        // Check ownership (or check if user is admin - assume role check later)
        if (review.user_id !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.destroy();
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

