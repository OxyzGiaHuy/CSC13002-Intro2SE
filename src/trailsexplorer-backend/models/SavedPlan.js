const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Trail = require('./Trail');

const SavedPlan = sequelize.define('SavedPlan', {
    plan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    trail_id: {
        type: DataTypes.INTEGER,
        references: { model: Trail, key: 'trail_id' },
        allowNull: true
    },
    location: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    difficulty: { type: DataTypes.STRING }, // EASY, MODERATE, HARD
    interests: { type: DataTypes.STRING },

    // JSONB for flexible storage of the AI response
    plan_data: { type: DataTypes.JSONB, allowNull: false },
    checklist: { type: DataTypes.JSONB }, // Array of strings or objects

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'saved_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // We don't necessarily need updated_at for a saved plan unless we allow editing
});

// Associations
User.hasMany(SavedPlan, { foreignKey: 'user_id' });
SavedPlan.belongsTo(User, { foreignKey: 'user_id' });

Trail.hasMany(SavedPlan, { foreignKey: 'trail_id' });
SavedPlan.belongsTo(Trail, { foreignKey: 'trail_id' });

module.exports = SavedPlan;
