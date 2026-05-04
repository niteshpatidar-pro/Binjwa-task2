require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Permission = require('./src/models/Permission');

const permissionsToSeed = [
    { resource: 'user', action: 'read', description: 'Read basic user details' },
    { resource: 'user', action: 'update', description: 'Update basic user details' },
    { resource: 'user', action: 'delete', description: 'Delete user account' },
    { resource: 'user', action: 'manage', description: 'Manage all users including roles' },
    
    { resource: 'role', action: 'read', description: 'Read roles' },
    { resource: 'role', action: 'create', description: 'Create roles' },
    { resource: 'role', action: 'update', description: 'Update roles' },
    { resource: 'role', action: 'manage', description: 'Manage roles and assignments' },
    
    { resource: 'permission', action: 'read', description: 'Read permissions' },
    { resource: 'permission', action: 'create', description: 'Create permissions' },
    
    { resource: 'request', action: 'approve', description: 'Approve access requests' },
    { resource: 'request', action: 'reject', description: 'Reject access requests' },
    { resource: 'request', action: 'read', description: 'Read access requests' }
];

const rolesToSeed = [
    { name: 'Admin', description: 'Super Administrator with full access', isSystem: true },
    { name: 'Analyst', description: 'Can read data and requests', isSystem: false },
    { name: 'Investor', description: 'Investor role', isSystem: false },
    { name: 'Founder', description: 'Founder role', isSystem: false },
    { name: 'User', description: 'Standard User', isSystem: true }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Seed Permissions
        console.log('Seeding permissions...');
        const createdPermissions = [];
        for (const p of permissionsToSeed) {
            const name = `${p.resource}:${p.action}`;
            let perm = await Permission.findOne({ name });
            if (!perm) {
                perm = await Permission.create({ ...p, name });
            }
            createdPermissions.push(perm);
        }

        // Seed Roles
        console.log('Seeding roles...');
        const createdRoles = {};
        for (const r of rolesToSeed) {
            let role = await Role.findOne({ name: r.name });
            if (!role) {
                role = await Role.create(r);
            }
            
            // Assign all permissions to Admin
            if (role.name === 'Admin') {
                role.permissions = createdPermissions.map(p => p._id);
                await role.save();
            } else if (role.name === 'Analyst') {
                role.permissions = createdPermissions.filter(p => p.action === 'read').map(p => p._id);
                await role.save();
            }
            
            createdRoles[r.name] = role;
        }

        // Seed Admin User
        const adminEmail = 'admin@flowsystem.com';
        let adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            adminUser.roles = [createdRoles['Admin']._id];
            adminUser.role = 'Admin';
            await adminUser.save();
            console.log('✅ Existing admin updated with RBAC roles:', adminEmail);
        } else {
            adminUser = new User({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword123',
                role: 'Admin',
                roles: [createdRoles['Admin']._id],
                isEmailVerified: true
            });
            await adminUser.save();
            console.log('✅ New Admin user created with RBAC.');
        }

        console.log('✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
