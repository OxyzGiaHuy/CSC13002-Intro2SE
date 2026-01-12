const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });

        try {
            // Fetch full user from DB to get latest role and details
            // We need to use require here if it wasn't imported at top-level to avoid circular deps if any,
            // but typical middleware usage implies models are ready.
            const User = require('../models/User'); // Lazy load or move to top
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; // Now req.user has .role, .id, etc.
            next();
        } catch (dbErr) {
            console.error('Auth Middleware DB Error:', dbErr);
            return res.status(500).json({ message: 'Internal Server Error during Auth' });
        }
    });
};

module.exports = authenticateToken;
