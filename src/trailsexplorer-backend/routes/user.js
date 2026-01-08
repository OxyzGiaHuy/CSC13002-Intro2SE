const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const SavedPlan = require('../models/SavedPlan');
const Trail = require('../models/Trail'); // Needed to fetch trail details in favorites
const authenticateToken = require('../middleware/authMiddleware');

// 1. GET /api/user/saved-plans
router.get('/saved-plans', authenticateToken, async (req, res) => {
    try {
        const plans = await SavedPlan.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET /api/user/favorites
router.get('/favorites', authenticateToken, async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { user_id: req.user.id, favorite_type: 'TRAIL' },
            order: [['created_at', 'DESC']]
        });

        // Fetch details (could be done via association if polymorphic, but manual fetch is safer for generic favorites table)
        // Ideally we define association Favorite.belongsTo(Trail) but since target_id is generic...
        // Let's manually fetch trails or assume client just needs IDs? Requirement says "List favorites".
        // Better output: List of trails.

        const trailIds = favorites.map(f => f.target_id);
        if (trailIds.length === 0) return res.json([]);

        const trails = await Trail.findAll({
            where: { trail_id: trailIds }
        });

        res.json(trails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. POST /api/user/favorites/:trailId
router.post('/favorites/:trailId', authenticateToken, async (req, res) => {
    try {
        const { trailId } = req.params;

        // Check if trail exists
        const trail = await Trail.findByPk(trailId);
        if (!trail) return res.status(404).json({ message: "Trail not found" });

        const [fav, created] = await Favorite.findOrCreate({
            where: {
                user_id: req.user.id,
                favorite_type: 'TRAIL',
                target_id: trailId
            }
        });

        if (created) {
            res.status(201).json({ message: "Added to favorites", favorite: fav });
        } else {
            res.json({ message: "Already in favorites", favorite: fav });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. DELETE /api/user/favorites/:trailId
router.delete('/favorites/:trailId', authenticateToken, async (req, res) => {
    try {
        const { trailId } = req.params;
        const deleted = await Favorite.destroy({
            where: {
                user_id: req.user.id,
                favorite_type: 'TRAIL',
                target_id: trailId
            }
        });

        if (deleted) {
            res.json({ message: "Removed from favorites" });
        } else {
            res.status(404).json({ message: "Favorite not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
