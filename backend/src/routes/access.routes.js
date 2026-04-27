const express = require('express');
const router = express.Router();
const { submitRequest, getRequestStatus } = require('../controllers/access.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/request', protect, submitRequest);
router.get('/status', protect, getRequestStatus);

module.exports = router;
