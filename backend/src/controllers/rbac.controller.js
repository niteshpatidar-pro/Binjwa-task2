const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { clearPermissionCache } = require('../middleware/auth.middleware');

// Permissions

exports.createPermission = async (req, res) => {
    try {
        const { resource, action, description } = req.body;
        const name = `${resource}:${action}`.toLowerCase();

        const permission = new Permission({
            name,
            resource,
            action,
            description
        });

        await permission.save();

        await AuditLog.create({
            actor: req.user._id,
            action: 'CREATE_PERMISSION',
            details: `Created permission ${name}`
        });

        res.status(201).json({ success: true, permission });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Permission already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().sort('resource action');
        res.json({ success: true, permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Roles

exports.createRole = async (req, res) => {
    try {
        const { name, description, isSystem } = req.body;

        const role = new Role({
            name,
            description,
            isSystem: isSystem || false
        });

        await role.save();

        await AuditLog.create({
            actor: req.user._id,
            action: 'CREATE_ROLE',
            details: `Created role ${name}`
        });

        res.status(201).json({ success: true, role });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Role already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json({ success: true, roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.assignPermissionsToRole = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        role.permissions = permissionIds;
        await role.save();

        await AuditLog.create({
            actor: req.user._id,
            action: 'UPDATE_ROLE_PERMISSIONS',
            details: `Updated permissions for role ${role.name}`
        });

        clearPermissionCache(); // Clear global cache on permission assignment

        const updatedRole = await Role.findById(roleId).populate('permissions');
        res.json({ success: true, role: updatedRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Users

exports.updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        
        const permission = await Permission.findById(id);
        if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' });
        
        const oldDesc = permission.description;
        permission.description = description;
        await permission.save();
        
        await AuditLog.create({
            actor: req.user._id,
            action: 'UPDATE_PERMISSION',
            details: `Updated permission ${permission.name}. Old: ${oldDesc}, New: ${description}`
        });
        
        clearPermissionCache(); // Clear global cache on permission update
        
        res.json({ success: true, permission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);
        if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' });
        
        // Remove permission from all roles
        await Role.updateMany(
            { permissions: id },
            { $pull: { permissions: id } }
        );
        
        await Permission.findByIdAndDelete(id);
        
        await AuditLog.create({
            actor: req.user._id,
            action: 'DELETE_PERMISSION',
            details: `Deleted permission ${permission.name}`
        });
        
        clearPermissionCache(); // Clear global cache on permission delete
        
        res.json({ success: true, message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        
        if (role.isSystem && name && name !== role.name) {
            return res.status(403).json({ success: false, message: 'Cannot rename system roles' });
        }
        
        const oldName = role.name;
        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        await role.save();
        
        await AuditLog.create({
            actor: req.user._id,
            action: 'UPDATE_ROLE',
            details: `Updated role ${oldName}. New name: ${role.name}`
        });
        
        clearPermissionCache(); // Clear global cache on role update
        
        res.json({ success: true, role });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Role name already exists' });
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        
        if (role.isSystem) {
            return res.status(403).json({ success: false, message: 'Cannot delete system roles' });
        }
        
        // Remove role from all users
        await User.updateMany(
            { roles: id },
            { $pull: { roles: id } }
        );
        
        await Role.findByIdAndDelete(id);
        
        await AuditLog.create({
            actor: req.user._id,
            action: 'DELETE_ROLE',
            details: `Deleted role ${role.name}`
        });
        
        clearPermissionCache(); // Clear global cache on role delete
        
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.assignRolesToUser = async (req, res) => {
    try {
        const { userId, roleIds } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.roles = roleIds;
        
        // Temporarily sync 'role' field for backward compatibility
        if (roleIds && roleIds.length > 0) {
            const firstRole = await Role.findById(roleIds[0]);
            if (firstRole) {
                user.role = firstRole.name;
            }
        } else {
            user.role = 'User';
        }

        await user.save();

        await AuditLog.create({
            actor: req.user._id,
            action: 'UPDATE_USER_ROLES',
            details: `Updated roles for user ${user.email}`
        });

        clearPermissionCache(userId); // Clear specific user's cache on role assignment

        const updatedUser = await User.findById(userId).populate('roles').select('-password');
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
