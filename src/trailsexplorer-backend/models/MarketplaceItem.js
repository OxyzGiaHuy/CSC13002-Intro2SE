const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const MarketplaceItem = sequelize.define('MarketplaceItem', {
    item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    seller_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    title: { type: DataTypes.STRING, allowNull: false }, // schema says title
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    condition: {
        type: DataTypes.ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'), // schema: NEW, LIKE_NEW, GOOD, FAIR, POOR
        defaultValue: 'GOOD'
    },

    // Schema uses images JSONB NOT NULL DEFAULT '[]'::jsonb
    // I will stick to schema definition for compatibility
    images: { type: DataTypes.JSONB, defaultValue: [] },

    status: {
        type: DataTypes.ENUM('DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'HIDDEN'),
        defaultValue: 'AVAILABLE'
    },
    category: { type: DataTypes.STRING }
}, {
    tableName: 'marketplace_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(MarketplaceItem, { foreignKey: 'seller_id' });
MarketplaceItem.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

module.exports = MarketplaceItem;
