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
    visited_date: { type: DataTypes.DATEONLY }
}, {
    tableName: 'trail_reviews',
    timestamps: false // Schema doesn't have created_at/updated_at explicitly? Wait, schema cut off. Assuming not or strict generic.
    // Checked schema: Helpful count etc. No timestamps shown in visible part for Reviews?
    // Wait, checking line 800ish of schema.
    // The snippet I saw ended at helpful_count. I'll assume no timestamps for now or minimal.
});

// Associations
Trail.hasMany(Review, { foreignKey: 'trail_id' });
Review.belongsTo(Trail, { foreignKey: 'trail_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Review;
