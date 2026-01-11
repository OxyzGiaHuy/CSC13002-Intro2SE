const User = require('../models/User');

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