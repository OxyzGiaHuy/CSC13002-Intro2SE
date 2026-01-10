const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// 1. GET /api/challenges: List challenges
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.findAll({
            order: [['end_date', 'ASC']]
        });
        // Mock progress for now since we don't have a user_challenges table yet in this iteration
        const challengesWithProgress = challenges.map(c => ({
            ...c.toJSON(),
            progress: Math.floor(Math.random() * c.target_value), // Mock random progress
            participants_count: Math.floor(Math.random() * 100) + 10
        }));
        res.json(challengesWithProgress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
