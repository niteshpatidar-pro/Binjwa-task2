const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: String,
    targetId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
