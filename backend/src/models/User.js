const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: function() { return !this.googleId; } },
    mobile: { type: String },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    // Keep 'role' string temporarily for backward compatibility during migration
    role: { 
        type: String, 
        enum: ['User', 'Investor', 'Founder', 'Partner', 'Admin'], 
        default: 'User' 
    },
    googleId: { type: String },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    avatar: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    kycStatus: { 
        type: String, 
        enum: ['None', 'Pending', 'Verified', 'Rejected'], 
        default: 'None' 
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshTokens: [String],
    lastLogin: Date,
    sessions: [{
        deviceId: String,
        lastActive: Date
    }]
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
