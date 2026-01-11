const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const PostLike = require('../models/PostLike');
const Notification = require('../models/Notification');
const authenticateToken = require('../middleware/authMiddleware');

const { Op } = require('sequelize');

// 1. GET /api/community/posts: List posts (Pagination & Filtering)
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, limit = 10, type, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            is_published: true,
            is_approved: true
        };

        // Filter by Type
        if (type && type !== 'ALL') {
            whereClause.content_type = type;
        }

        // Search by Title or Content
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: rawRows } = await CommunityPost.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['username', 'avatar_url', 'bio', 'home_city', 'total_distance_km', 'total_trips_completed', 'total_trails_conquered'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        let rows = rawRows;

        // If user is logged in, check which posts they have liked
        const userId = req.query.userId || (req.user ? req.user.id : null); // Simple fallback for testing
        if (userId && rows.length > 0) {
            const likedPostIds = await PostLike.findAll({
                where: { user_id: userId, post_id: { [Op.in]: rows.map(p => p.post_id) } },
                attributes: ['post_id']
            });
            const likedSet = new Set(likedPostIds.map(l => l.post_id));
            rows = rows.map(p => ({
                ...p.toJSON(),
                is_liked: likedSet.has(p.post_id)
            }));
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

// 2. POST /api/community/posts: Create Post
router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { title, content, content_type, media_urls, trail_id } = req.body;

        const newPost = await CommunityPost.create({
            user_id: req.user.id,
            title,
            content,
            content_type: content_type || 'TEXT',
            media_urls: media_urls || [],
            trail_id
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Create Post Error:", err); // Log full error
        res.status(500).json({ error: err.message, details: err.errors }); // Return details
    }
});

// 3. DELETE /api/community/posts/:id
router.delete('/posts/:id', authenticateToken, async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user_id !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.destroy();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. POST /api/community/posts/:id/like
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await CommunityPost.findByPk(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const existingLike = await PostLike.findOne({ where: { post_id: postId, user_id: userId } });

        if (existingLike) {
            // Unlike
            await existingLike.destroy();
            post.like_count = Math.max(0, (post.like_count || 0) - 1);
            await post.save();
            res.json({ like_count: post.like_count, is_liked: false });
        } else {
            // Like
            await PostLike.create({ post_id: postId, user_id: userId });
            post.like_count = (post.like_count || 0) + 1;
            await post.save();

            // Create notification for post owner
            if (post.user_id !== userId) {
                await Notification.create({
                    user_id: post.user_id,
                    type: 'LIKE',
                    title: 'New Like!',
                    message: `Someone liked your post: "${post.title || post.content.substring(0, 20)}..."`,
                    data: { post_id: postId, liked_by: userId }
                });
            }

            res.json({ like_count: post.like_count, is_liked: true });
        }
    } catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Notifications Endpoint
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            limit: 20
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { notification_id: req.params.id, user_id: req.user.id }
        });
        if (notification) {
            notification.is_read = true;
            await notification.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. POST /api/community/posts/:id/share
router.post('/posts/:id/share', authenticateToken, async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.share_count = (post.share_count || 0) + 1;
        await post.save();

        res.json({ share_count: post.share_count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
