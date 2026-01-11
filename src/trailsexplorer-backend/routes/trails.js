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
            include: [
                {
                    model: Review,
                    where: { is_approved: true, is_published: true },
                    required: false,
                    include: [{ model: User, attributes: ['username', 'avatar_url'] }],
                    order: [['created_at', 'DESC']],
                    limit: 5 // Initial reviews
                },
                {
                    model: TrailImage,
                    as: 'images',
                    required: false
                }
            ]
        });

        if (!trail) return res.status(404).json({ message: "Trail not found" });

        const t = trail.toJSON();
        // ensure image_url is at top level if needed, or frontend can use images array
        t.image_url = t.images && t.images.length > 0 ? t.images[0].image_url : null;
        t.avg_rating = parseFloat(t.avg_rating) || 0;
        t.num_reviews = parseInt(t.num_reviews) || 0;

        res.json(t);
    } catch (err) {
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

