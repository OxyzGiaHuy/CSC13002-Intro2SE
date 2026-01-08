const express = require('express');
const router = express.Router();
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
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

                // Attach featured image_url from trail_images when available
                try {
                    const trailIds = rows.map(r => r.trail_id).filter(Boolean);
                    if (trailIds.length > 0) {
                        const images = await sequelize.query(
                            `SELECT trail_id, image_url FROM trail_images WHERE trail_id IN (${trailIds.join(',')}) AND is_featured = true`,
                            { type: QueryTypes.SELECT }
                        );
                        const imageMap = {};
                        images.forEach(i => { imageMap[i.trail_id] = i.image_url; });
                        // attach image_url to each row (plain object)
                        const data = rows.map(r => ({ ...r.get ? r.get() : r, image_url: imageMap[r.trail_id] || null }));
                        return res.json({ total: count, page: parseInt(page), pages: Math.ceil(count / limit), data });
                    }
                } catch (e) {
                    // silent: if image join fails, fall back to raw rows
                    console.error('Failed to attach trail images', e.message || e);
                }

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

        // Try to attach a featured image from trail_images
        try {
            const images = await sequelize.query(
                `SELECT image_url FROM trail_images WHERE trail_id = ${req.params.id} AND is_featured = true LIMIT 1`,
                { type: QueryTypes.SELECT }
            );
            const image = images && images[0] && images[0].image_url ? images[0].image_url : null;
            const out = trail.get ? trail.get() : trail;
            out.image_url = out.image_url || image;
            return res.json(out);
        } catch (e) {
            console.error('Failed to attach trail image for detail', e.message || e);
            return res.json(trail);
        }
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
