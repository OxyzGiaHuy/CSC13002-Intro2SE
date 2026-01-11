const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

const authenticateToken = require('../middleware/authMiddleware'); // Fixed import to match module.exports assignment
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User');

// 1. GET /api/challenges: List challenges with join status
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const challenges = await Challenge.findAll({
            order: [['end_date', 'ASC']],
            include: userId ? [{
                model: UserChallenge,
                where: { user_id: userId },
                required: false
            }] : []
        });

        const challengesWithData = challenges.map(c => {
            const userChallenge = c.UserChallenges && c.UserChallenges[0];
            return {
                ...c.toJSON(),
                is_joined: !!userChallenge,
                status: userChallenge ? userChallenge.status : 'AVAILABLE',
                progress: userChallenge ? parseFloat(userChallenge.progress) : 0,
                // Mock participants count for now or aggregate
                participants_count: Math.floor(Math.random() * 100) + 10
            };
        });

        res.json(challengesWithData);
    } catch (err) {
        console.error("Error fetching challenges:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /api/challenges/:id/join
router.post('/:id/join', authenticateToken, async (req, res) => {
    try {
        const challengeId = req.params.id;
        console.log("DEBUG: join request user:", req.user);
        const userId = req.user.id || req.user.userId; // Try both just in case
        console.log(`DEBUG: attempting to join challenge ${challengeId} with user ${userId}`);

        const challenge = await Challenge.findByPk(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        const [entry, created] = await UserChallenge.findOrCreate({
            where: { user_id: userId, challenge_id: challengeId },
            defaults: {
                status: 'JOINED',
                progress: 0,
                joined_at: new Date()
            }
        });

        if (!created && entry.status === 'JOINED') {
            return res.status(400).json({ message: "Already joined this challenge" });
        }

        // If re-joining (e.g. was FAILED), update it
        if (!created) {
            entry.status = 'JOINED';
            entry.joined_at = new Date();
            await entry.save();
        }

        res.status(200).json({ message: "Joined challenge successfully", entry });

    } catch (err) {
        console.error("Join challenge error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
