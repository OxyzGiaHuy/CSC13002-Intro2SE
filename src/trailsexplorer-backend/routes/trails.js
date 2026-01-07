const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Trail = require('../models/Trail');
const Review = require('../models/Review');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');

// 1. GET /api/trails: List trails (Pagination, Filtering)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, difficulty, location } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (difficulty) where.difficulty = difficulty;
        if (location) where.location_province = { [Op.iLike]: `%${location}%` };

        const { count, rows } = await Trail.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            data: rows
        });
    } catch (err) {
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
            limit: 20
        });

        res.json(trails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET /api/trails/:id: Detail + Reviews
router.get('/:id', async (req, res) => {
    try {
        const trail = await Trail.findByPk(req.params.id, {
            include: [{
                model: Review,
                include: [{ model: User, attributes: ['username', 'avatar_url'] }],
                order: [['created_at', 'DESC']],
                limit: 5 // Initial reviews
            }]
        });

        if (!trail) return res.status(404).json({ message: "Trail not found" });
        res.json(trail);
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
