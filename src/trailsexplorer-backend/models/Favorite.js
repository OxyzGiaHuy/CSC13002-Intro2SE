const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Favorite = sequelize.define('Favorite', {
    favorite_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    favorite_type: {
        type: DataTypes.ENUM('TRAIL', 'POI', 'TRIP_PLAN', 'POST', 'MARKETPLACE_ITEM'),
        allowNull: false
    },
    target_id: { type: DataTypes.INTEGER, allowNull: false },
    notes: { type: DataTypes.TEXT }
}, {
    tableName: 'user_favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Favorite;
