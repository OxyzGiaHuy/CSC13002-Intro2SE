const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User');
const GroupMessage = require('../models/GroupMessage');
const authenticateToken = require('../middleware/authMiddleware');

// 1. GET /api/groups: List groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [
                { model: User, as: 'owner', attributes: ['user_id', 'username', 'avatar_url'] },
                { model: User, as: 'members', attributes: ['user_id', 'username', 'avatar_url'], through: { attributes: [] } }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /api/groups: Create Group
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, description, privacy, image_url } = req.body;
        // Map frontend 'privacy' (PUBLIC/PRIVATE) to group_type
        // Map frontend 'image_url' to avatar_url
        const newGroup = await Group.create({
            created_by: req.user.id,
            name,
            description,
            group_type: privacy === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
            avatar_url: image_url
        });

        // Add owner as admin member
        await GroupMember.create({
            group_id: newGroup.group_id,
            user_id: req.user.id,
            role: 'OWNER' // Using OWNER as they created it
        });

        res.status(201).json(newGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST /api/groups/:id/join: Join Group
router.post('/:id/join', authenticateToken, async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        const existingMember = await GroupMember.findOne({
            where: { group_id: group.group_id, user_id: req.user.id }
        });

        if (!existingMember) {
            await GroupMember.create({
                group_id: group.group_id,
                user_id: req.user.id,
                role: 'MEMBER'
            });
        }

        res.json({ message: "Joined group successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// 4. GET /api/groups/:id/messages: Get messages
router.get('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await GroupMessage.findAll({
            where: { group_id: req.params.id },
            include: [{ model: User, as: 'sender', attributes: ['user_id', 'username', 'avatar_url', 'role'] }],
            order: [['created_at', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. POST /api/groups/:id/messages: Send message
router.post('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const newMessage = await GroupMessage.create({
            group_id: req.params.id,
            user_id: req.user.id,
            content
        });

        const messageWithSender = await GroupMessage.findByPk(newMessage.message_id, {
            include: [{ model: User, as: 'sender', attributes: ['user_id', 'username', 'avatar_url', 'role'] }]
        });

        res.status(201).json(messageWithSender);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
