const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, verifyEmail, loginUser } = require('../controllers/authController');

// Đăng ký
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);

// Đăng nhập
router.post('/login', loginUser);

// Đăng xuất
router.post('/logout', (req, res) => {
    // Client should clear the token from storage
    res.json({ message: "Logout thành công" });
});

module.exports = router;