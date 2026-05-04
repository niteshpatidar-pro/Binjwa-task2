const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // format: resource:action e.g., 'user:read'
    },
    resource: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: ['create', 'read', 'update', 'delete', 'manage', 'approve', 'reject', 'assign'],
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Prevent duplicate permissions
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);
