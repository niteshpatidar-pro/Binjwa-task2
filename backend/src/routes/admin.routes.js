const express = require('express');
const router = express.Router();
const { getAllRequests, updateRequestStatus, getAuditLogs } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/requests', getAllRequests);
router.patch('/requests/:requestId', updateRequestStatus);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
