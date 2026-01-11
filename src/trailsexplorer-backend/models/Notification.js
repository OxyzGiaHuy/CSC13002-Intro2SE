const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
    notification_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    type: {
        type: DataTypes.ENUM('LIKE', 'COMMENT', 'SHARE', 'CHALLENGE_EARNED', 'GROUP_INVITE', 'SYSTEM'),
        allowNull: false
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    data: { type: DataTypes.JSONB, defaultValue: {} } // For storing related IDs (post_id, group_id, etc.)
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Notification;
