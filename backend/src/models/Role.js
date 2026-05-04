const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    isSystem: {
        type: Boolean,
        default: false, // True for critical roles like 'Admin' that cannot be deleted
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
