const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Trail = require('./Trail');

const Review = sequelize.define('Review', {
    review_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    trail_id: {
        type: DataTypes.INTEGER,
        references: { model: Trail, key: 'trail_id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' } // User model in schema uses user_id
    },
    overall_rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 }, allowNull: false },
    content: { type: DataTypes.TEXT },
    visited_date: { type: DataTypes.DATEONLY },
    helpful_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    // Moderation fields
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
    moderated_at: { type: DataTypes.DATE, allowNull: true },
    moderated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: User, key: 'user_id' }
    }
}, {
    tableName: 'trail_reviews',
    timestamps: true, // Schema has created_at, updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
Trail.hasMany(Review, { foreignKey: 'trail_id' });
Review.belongsTo(Trail, { foreignKey: 'trail_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Review;
