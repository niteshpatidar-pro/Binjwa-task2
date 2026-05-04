const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middleware/auth.middleware');
const {
    createPermission,
    getPermissions,
    updatePermission,
    deletePermission,
    createRole,
    getRoles,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    assignRolesToUser
} = require('../controllers/rbac.controller');

// All RBAC routes require authentication
router.use(protect);

// Permissions
router.post('/permissions', checkPermission('permission', 'create'), createPermission);
router.get('/permissions', checkPermission('permission', 'read'), getPermissions);
router.put('/permissions/:id', checkPermission('permission', 'update'), updatePermission);
router.delete('/permissions/:id', checkPermission('permission', 'delete'), deletePermission);

// Roles
router.post('/roles', checkPermission('role', 'create'), createRole);
router.get('/roles', checkPermission('role', 'read'), getRoles);
router.put('/roles/:id', checkPermission('role', 'update'), updateRole);
router.delete('/roles/:id', checkPermission('role', 'delete'), deleteRole);
router.post('/roles/assign-permissions', checkPermission('role', 'manage'), assignPermissionsToRole);

// Users (Role Assignment)
router.post('/users/assign-role', checkPermission('user', 'manage'), assignRolesToUser);

module.exports = router;
