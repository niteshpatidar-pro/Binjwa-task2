const jwt = require('jsonwebtoken');
const User = require('../models/User');
const permissionsConfig = require('../config/permissions');

// Simple in-memory cache for user permissions (optimization)
// In a real production environment, use Redis for this.
const permissionCache = new Map();

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check cache first
        const cacheKey = `user_perms_${decoded.id}`;
        if (permissionCache.has(cacheKey)) {
            const cachedData = permissionCache.get(cacheKey);
            // Quick expiry check (e.g., 5 minutes)
            if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
                req.user = cachedData.user;
                return next();
            }
        }

        const user = await User.findById(decoded.id)
            .select('-password')
            .populate({
                path: 'roles',
                populate: { path: 'permissions' }
            });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        // Attach permissions as a flat array of strings to req.user for easy checking
        const permissions = new Set();
        if (user.roles && user.roles.length > 0) {
            user.roles.forEach(role => {
                if (role.permissions) {
                    role.permissions.forEach(p => {
                        if (p && p.resource && p.action) {
                            permissions.add(`${p.resource}:${p.action}`);
                        }
                    });
                }
            });
        }
        user.permissionList = Array.from(permissions);
        req.user = user;

        // Save to cache
        permissionCache.set(cacheKey, {
            user: user,
            timestamp: Date.now()
        });

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
};

// Helper function to clear cache (call this when roles/permissions update)
exports.clearPermissionCache = (userId = null) => {
    if (userId) {
        permissionCache.delete(`user_perms_${userId}`);
    } else {
        permissionCache.clear();
    }
};

exports.checkPermission = (resource, action) => {
    return (req, res, next) => {
        // Superadmin override
        if (req.user.role === 'Admin' || (req.user.roles && req.user.roles.some(r => r.name === 'Admin'))) {
            return next();
        }

        const requiredPermission = `${resource}:${action}`;
        if (!req.user.permissionList || !req.user.permissionList.includes(requiredPermission)) {
            return res.status(403).json({ 
                success: false, 
                message: `You do not have permission to perform ${action} on ${resource}` 
            });
        }
        next();
    };
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};

exports.checkAction = (requiredAction) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        
        // Admin override or role checking
        if (userRole === 'Admin') {
            return next();
        }

        const allowedActions = permissionsConfig[userRole] || [];
        
        if (!allowedActions.includes(requiredAction)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Your role (${userRole}) does not have the '${requiredAction}' permission.`
            });
        }
        
        next();
    };
};
