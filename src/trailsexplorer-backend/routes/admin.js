const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Review = require('../models/Review');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const Trail = require('../models/Trail');
const authenticateToken = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(adminMiddleware);

// ==================== TRAIL REVIEWS MODERATION ====================

// GET /api/admin/reviews - Fetch all reviews with filtering
router.get('/reviews', async (req, res) => {
    try {
        console.log('Review Associations:', Object.keys(Review.associations));
        const { status = 'all', page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};

        // Filter by status
        if (status === 'pending') {
            whereClause.is_approved = false;
        } else if (status === 'approved') {
            whereClause.is_approved = true;
            whereClause.is_published = true;
        } else if (status === 'hidden') {
            whereClause.is_published = false;
        }

        // Search filter
        if (search) {
            whereClause.content = { [Op.iLike]: `%${search}%` };
        }

        const { count, rows } = await Review.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url', 'email']
                },
                {
                    model: Trail,
                    attributes: ['trail_id', 'name', 'location_province']
                }
            ],
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
        console.error('Admin fetch reviews error:', err);
        res.status(500).json({
            error: err.message,
            associations: Object.keys(Review.associations),
            modelName: Review.name
        });
    }
});

// PUT /api/admin/reviews/:id/approve - Approve a review
router.put('/reviews/:id/approve', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.is_approved = true;
        review.is_published = true;
        review.moderated_at = new Date();
        review.moderated_by = req.user.id;

        await review.save();

        res.json({
            message: 'Review approved successfully',
            review
        });
    } catch (err) {
        console.error('Approve review error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/reviews/:id/hide - Hide/unpublish a review
router.put('/reviews/:id/hide', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.is_published = false;
        review.moderated_at = new Date();
        review.moderated_by = req.user.id;

        await review.save();

        res.json({
            message: 'Review hidden successfully',
            review
        });
    } catch (err) {
        console.error('Hide review error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/reviews/:id/unhide - Unhide/republish a review
router.put('/reviews/:id/unhide', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.is_published = true;
        review.moderated_at = new Date();
        review.moderated_by = req.user.id;

        await review.save();

        res.json({
            message: 'Review unhidden successfully',
            review
        });
    } catch (err) {
        console.error('Unhide review error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/reviews/:id - Permanently delete a review
router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.destroy();

        res.json({ message: 'Review deleted permanently' });
    } catch (err) {
        console.error('Delete review error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== COMMUNITY POSTS MODERATION ====================

// GET /api/admin/posts - Fetch all community posts with filtering
router.get('/posts', async (req, res) => {
    try {
        const { status = 'all', page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};

        // Filter by status
        if (status === 'pending') {
            whereClause.is_approved = false;
        } else if (status === 'approved') {
            whereClause.is_approved = true;
            whereClause.is_published = true;
        } else if (status === 'reported') {
            whereClause.report_count = { [Op.gt]: 0 };
        }

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await CommunityPost.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url', 'email']
                },
                {
                    model: Trail,
                    attributes: ['trail_id', 'name'],
                    required: false
                }
            ],
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
        console.error('Admin fetch posts error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/posts/:id/approve - Approve a post
router.put('/posts/:id/approve', async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.is_approved = true;
        post.is_published = true;
        post.moderated_at = new Date();
        post.moderated_by = req.user.id;

        await post.save();

        res.json({
            message: 'Post approved successfully',
            post
        });
    } catch (err) {
        console.error('Approve post error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/posts/:id/unapprove - Unapprove a post
router.put('/posts/:id/unapprove', async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.is_approved = false;
        post.moderated_at = new Date();
        post.moderated_by = req.user.id;

        await post.save();

        res.json({
            message: 'Post unapproved successfully',
            post
        });
    } catch (err) {
        console.error('Unapprove post error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/posts/:id - Delete a post permanently
router.delete('/posts/:id', async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.destroy();

        res.json({ message: 'Post deleted permanently' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/stats - Get moderation statistics
router.get('/stats', async (req, res) => {
    try {
        const [
            pendingReviews,
            totalReviews,
            pendingPosts,
            totalPosts,
            reportedPosts
        ] = await Promise.all([
            Review.count({ where: { is_approved: false } }),
            Review.count(),
            CommunityPost.count({ where: { is_approved: false } }),
            CommunityPost.count(),
            CommunityPost.count({ where: { report_count: { [Op.gt]: 0 } } })
        ]);

        res.json({
            reviews: {
                pending: pendingReviews,
                total: totalReviews
            },
            posts: {
                pending: pendingPosts,
                total: totalPosts,
                reported: reportedPosts
            }
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
