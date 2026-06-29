const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
    const authorization = req.get('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization token is required'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: 'JWT_SECRET is not configures'
        });
    }

    const token = authorization.slice(7).trim();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'User account no longer exists'
            });
        }

        if (user.status === 'BLOCKED') {
            return res.status(403).json({
                message: 'User account is blocked'
            });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Authentication token is invalid or expired'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Administrator access is required'
        });
    }

    next();
};

module.exports = {
    auth,
    adminOnly
};