const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Group = require('../models/Group');

// @desc    Xóa user theo ID (Dùng để dọn dẹp data test)
// @route   DELETE /api/user/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID từ URL

        // 1. Tìm user xem có tồn tại không
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404);
            throw new Error('User không tồn tại');
        }

        // 2. Thực hiện xóa
        await user.destroy();

        // 3. Trả về kết quả
        res.status(200).json({
            success: true,
            message: `Đã xóa thành công user có ID: ${id}`
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Lấy danh sách Users (cho Admin Dashboard)
// @route   GET /api/user
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Không trả về password
            order: [['created_at', 'DESC']]
        });

        // Format data for frontend dashboard
        const formattedUsers = users.map(user => {
            const totalKm = parseFloat(user.total_distance_km) || 0;
            const totalElevation = parseFloat(user.total_elevation_gain) || 0;
            const totalTrips = user.total_trips_completed || 0;

            // Calculate average altitude (avoid division by zero)
            const avgAltitude = totalTrips > 0 ? Math.round(totalElevation / totalTrips) : 0;

            // Avg time is not yet tracked in DB, so return 0
            const avgTimeHr = 0;

            // Return plain object with added fields
            return {
                ...user.toJSON(),
                totalKm,
                avgAltitude,
                avgTimeHr
            };
        });

        res.json(formattedUsers);
    } catch (error) {
        next(error);
    }
};

// @desc    Lấy thống kê Users (Active Trekkers, New Users...)
// @route   GET /api/user/stats
exports.getUserStats = async (req, res, next) => {
    try {
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { is_active: true } });
        const totalGroups = await Group.count();
        const newUsersToday = await User.count({
            where: {
                created_at: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        res.json({
            total_users: totalUsers,
            active_users: activeUsers,
            total_groups: totalGroups,
            new_users_today: newUsersToday
        });
    } catch (error) {
        next(error);
    }
};

exports.getGrowthStats = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch User Growth
        const userGrowth = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('user_id')), 'count']
            ],
            where: { created_at: { [Op.gte]: sevenDaysAgo } },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
        });

        // Fetch Group Growth
        const groupGrowth = await Group.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('group_id')), 'count']
            ],
            where: { created_at: { [Op.gte]: sevenDaysAgo } },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
        });

        // Calculate Initials (users before 7 days ago)
        const totalUsersBefore = await User.count({ where: { created_at: { [Op.lt]: sevenDaysAgo } } });
        const totalGroupsBefore = await Group.count({ where: { created_at: { [Op.lt]: sevenDaysAgo } } });

        let currentUserTotal = totalUsersBefore;
        let currentGroupTotal = totalGroupsBefore;

        const formattedData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Maps
        const userMap = {};
        userGrowth.forEach(d => userMap[d.get('date')] = parseInt(d.get('count')));

        const groupMap = {};
        groupGrowth.forEach(d => groupMap[d.get('date')] = parseInt(d.get('count')));

        // Loop last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];

            currentUserTotal += (userMap[dateKey] || 0);
            currentGroupTotal += (groupMap[dateKey] || 0);

            formattedData.push({
                day: dayName,
                users: currentUserTotal,
                groups: currentGroupTotal
            });
        }

        res.json(formattedData);
    } catch (error) {
        next(error);
    }
};