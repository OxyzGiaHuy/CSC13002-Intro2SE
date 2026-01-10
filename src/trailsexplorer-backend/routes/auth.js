const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Basic validation
        if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password are required' });

        // Check for existing username or email to provide a friendly error
        const existing = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
        if (existing) {
            const conflicts = [];
            if (existing.username === username) conflicts.push('username');
            if (existing.email === email) conflicts.push('email');
            return res.status(409).json({ message: `The following fields already exist: ${conflicts.join(', ')}` });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        // Do not return password hash to client
        const userSafe = { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role };
        res.status(201).json({ user: userSafe });
    } catch (err) {
        console.error("Register Error:", err);
        // Handle unique constraint thrown directly from DB as a fallback
        if (err && err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
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
            return res.status(404).json({ message: "Email not found" });
        }

        console.log(`[Auth] User found: ${user.username}, Stored hash: ${user.password.substring(0, 10)}...`);
        console.log(`[Auth] Comparing password length: ${password?.length}`);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Auth] Password match result: ${isMatch}`);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
        const userSafe = { id: user.id, username: user.username, email: user.email, role: user.role };
        res.json({ message: "Login successful", token, user: userSafe });
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