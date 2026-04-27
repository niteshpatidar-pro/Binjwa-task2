const AccessRequest = require('../models/AccessRequest');
const { evaluateEligibility } = require('../utils/scoring.utils');

exports.submitRequest = async (req, res) => {
    try {
        const { requestedRole, formData } = req.body;
        const userId = req.user.id;

        // Check if user already has a pending request
        const existingRequest = await AccessRequest.findOne({ userId, status: 'Pending' });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'You already have a pending request.' });
        }

        const score = evaluateEligibility(requestedRole, formData);

        const newRequest = new AccessRequest({
            userId,
            requestedRole,
            formData,
            score
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            message: 'Access request submitted successfully.',
            score
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRequestStatus = async (req, res) => {
    try {
        const request = await AccessRequest.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        if (!request) {
            return res.json({ success: true, request: null });
        }
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
