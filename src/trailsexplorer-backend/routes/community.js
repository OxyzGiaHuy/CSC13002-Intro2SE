const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');

// 1. GET /api/community/posts: List posts (Pagination)
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await CommunityPost.findAndCountAll({
            where: { is_published: true, visibility: 'PUBLIC' }, // Basic filtering
            include: [{ model: User, attributes: ['username', 'avatar_url'] }],
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

module.exports = router;
