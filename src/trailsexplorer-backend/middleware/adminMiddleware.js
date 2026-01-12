const adminMiddleware = (req, res, next) => {
    // Check if user exists (should be set by authenticateToken middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
            message: 'Access Denied: Admin privileges required',
            userRole: req.user.role 
        });
    }

    // User is admin, proceed to route handler
    next();
};

module.exports = adminMiddleware;
