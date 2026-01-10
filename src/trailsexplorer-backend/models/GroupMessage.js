const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Group = require('./Group');

const GroupMessage = sequelize.define('GroupMessage', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'group_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    media_urls: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'group_messages',
    timestamps: false
});

// Relationships
GroupMessage.belongsTo(User, { foreignKey: 'user_id', as: 'sender' });
GroupMessage.belongsTo(Group, { foreignKey: 'group_id' });
Group.hasMany(GroupMessage, { foreignKey: 'group_id', as: 'messages' });

module.exports = GroupMessage;
