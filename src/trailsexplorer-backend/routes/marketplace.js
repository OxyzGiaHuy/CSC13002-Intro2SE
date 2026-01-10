const express = require('express');
const router = express.Router();
const MarketplaceItem = require('../models/MarketplaceItem');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');

const { Op } = require('sequelize');

// 1. GET /api/marketplace: List items
router.get('/', async (req, res) => {
    try {
        const { category, price_min, price_max, condition, search } = req.query;
        console.log("Marketplace Query Params:", { category, price_min, price_max, condition, search });

        const whereClause = { status: 'AVAILABLE' };

        if (category && category !== 'ALL') whereClause.category = category;
        if (condition && condition !== 'ALL') whereClause.condition = condition;

        if (price_min || price_max) {
            whereClause.price = {};
            if (price_min) whereClause.price[Op.gte] = Number(price_min);
            if (price_max) whereClause.price[Op.lte] = Number(price_max);
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        console.log("Marketplace whereClause:", whereClause);

        const items = await MarketplaceItem.findAll({
            where: whereClause,
            include: [{ model: User, as: 'seller', attributes: ['username', 'avatar_url'] }],
            order: [['created_at', 'DESC']]
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST /api/marketplace: Create Item
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log("Creating Marketplace Item:", req.body);
        const { title, description, price, condition, image_url, category } = req.body;
        // Convert single image_url to images array for schema compatibility
        const images = image_url ? [image_url] : [];

        const newItem = await MarketplaceItem.create({
            seller_id: req.user.id,
            title,
            description,
            price,
            condition: condition || 'GOOD',
            images,
            category: category || 'OTHER',
            status: 'AVAILABLE'
        });
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Error creating marketplace item:", err);
        res.status(500).json({ error: err.message, details: err.errors });
    }
});

module.exports = router;
