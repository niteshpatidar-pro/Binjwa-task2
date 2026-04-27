const AccessRequest = require('../models/AccessRequest');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getAllRequests = async (req, res) => {
    try {
        const { status, role, search } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (role) query.requestedRole = role;

        const requests = await AccessRequest.find(query)
            .populate('userId', 'name email mobile')
            .sort({ createdAt: -1 });

        // Simple search filter in-memory if needed, or refine query
        let filteredRequests = requests;
        if (search) {
            filteredRequests = requests.filter(r => 
                r.userId.name.toLowerCase().includes(search.toLowerCase()) ||
                r.userId.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        res.json({ success: true, requests: filteredRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, adminComments } = req.body;

        const request = await AccessRequest.findById(requestId);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        request.status = status;
        request.adminComments = adminComments;
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();

        await request.save();

        // If approved, update user role
        if (status === 'Approved') {
            await User.findByIdAndUpdate(request.userId, { role: request.requestedRole });
        }

        // Log action
        await AuditLog.create({
            action: `REQUEST_${status}`,
            actor: req.user.id,
            targetType: 'AccessRequest',
            targetId: request._id,
            details: { status, adminComments }
        });

        res.json({ success: true, message: `Request ${status.toLowerCase()} successfully.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('actor', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
