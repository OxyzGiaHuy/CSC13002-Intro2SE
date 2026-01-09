const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: err.message, details: err.errors });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Auth] Attempting login for email: ${email}`);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`[Auth] Email not found: ${email}`);
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        console.log(`[Auth] User found: ${user.username}, Stored hash: ${user.password.substring(0, 10)}...`);
        console.log(`[Auth] Comparing password length: ${password?.length}`);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Auth] Password match result: ${isMatch}`);

        if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ message: "Login thành công", token, user });
    } catch (err) {
        console.error("[Auth] Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Đăng xuất
router.post('/logout', (req, res) => {
    // Client should clear the token from storage
    res.json({ message: "Logout thành công" });
});

module.exports = router;