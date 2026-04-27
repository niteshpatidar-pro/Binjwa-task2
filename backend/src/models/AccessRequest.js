const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedRole: { 
        type: String, 
        enum: ['Investor', 'Founder', 'Partner'], 
        required: true 
    },
    formData: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'More_Info_Needed'], 
        default: 'Pending' 
    },
    score: { type: Number, default: 0 },
    adminComments: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
