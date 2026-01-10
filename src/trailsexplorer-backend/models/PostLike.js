const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const CommunityPost = require('./CommunityPost');

const PostLike = sequelize.define('PostLike', {
    like_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    post_id: {
        type: DataTypes.INTEGER,
        references: { model: CommunityPost, key: 'post_id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    }
}, {
    tableName: 'post_likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // No update for likes
});

// Associations
User.hasMany(PostLike, { foreignKey: 'user_id' });
PostLike.belongsTo(User, { foreignKey: 'user_id' });

CommunityPost.hasMany(PostLike, { foreignKey: 'post_id' });
PostLike.belongsTo(CommunityPost, { foreignKey: 'post_id' });

module.exports = PostLike;
