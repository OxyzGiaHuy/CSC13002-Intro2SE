const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const CommunityPost = require('./CommunityPost');

const Comment = sequelize.define('Comment', {
    comment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    post_id: {
        type: DataTypes.INTEGER,
        references: { model: CommunityPost, key: 'post_id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    content: { type: DataTypes.TEXT, allowNull: false }
}, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations defined here or in server.js, but good practice to keep model clean
// We will define associations in server.js to avoid circular deps issues if any

module.exports = Comment;
