import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, Plus, Edit, Trash2, Save, Shield, Key } from 'lucide-react';
import RoleGuard from '../components/RoleGuard';

const RBACManager = () => {
    const [activeTab, setActiveTab] = useState('roles');
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes, usersRes] = await Promise.all([
                api.get('/rbac/roles'),
                api.get('/rbac/permissions'),
                api.get('/admin/users')
            ]);
            setRoles(rolesRes.data.roles);
            setPermissions(permsRes.data.permissions);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error("Failed to fetch RBAC data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Role Assignments State
    const handleAssignRole = async (userId, roleId) => {
        try {
            await api.post('/rbac/users/assign-role', {
                userId,
                roleIds: [roleId] // Assuming single role for now in UI
            });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign role');
        }
    };

    const handleAssignPermission = async (roleId, permissionId, assign) => {
        const role = roles.find(r => r._id === roleId);
        let newPerms = role.permissions.map(p => p._id);
        
        if (assign) {
            newPerms.push(permissionId);
        } else {
            newPerms = newPerms.filter(id => id !== permissionId);
        }

        try {
            await api.post('/rbac/roles/assign-permissions', {
                roleId,
                permissionIds: newPerms
            });
            fetchData();
        } catch (error) {
            alert('Failed to update permissions');
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" size={32} /></div>;

    return (
        <RoleGuard allowedRoles={['Admin']} requiredPermission="role:manage" fallback={<div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>}>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="text-blue-500" /> RBAC Management
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
                    <button 
                        onClick={() => setActiveTab('roles')}
                        className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Roles & Permissions
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        User Role Assignment
                    </button>
                </div>

                {activeTab === 'roles' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Roles List */}
                        <div className="lg:col-span-1 glass p-6 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                                Roles
                            </h2>
                            <div className="space-y-3">
                                {roles.map(role => (
                                    <div key={role._id} className="p-3 border border-gray-700 rounded bg-gray-800/50 hover:bg-gray-800 transition">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-white">{role.name}</span>
                                            {role.isSystem && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">System</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Permission Matrix */}
                        <div className="lg:col-span-2 glass p-6 rounded-xl overflow-x-auto">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Key size={20} /> Permission Matrix
                            </h2>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-400">
                                        <th className="p-2 font-medium">Permission</th>
                                        {roles.map(role => (
                                            <th key={role._id} className="p-2 font-medium text-center">{role.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map(perm => (
                                        <tr key={perm._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                            <td className="p-2 text-gray-300">
                                                <div className="font-medium text-white">{perm.name}</div>
                                                <div className="text-xs opacity-70">{perm.description}</div>
                                            </td>
                                            {roles.map(role => {
                                                const hasPerm = role.permissions.some(p => p._id === perm._id);
                                                return (
                                                    <td key={role._id} className="p-2 text-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={hasPerm}
                                                            onChange={(e) => handleAssignPermission(role._id, perm._id, e.target.checked)}
                                                            disabled={role.name === 'Admin'} // Admin always has everything
                                                            className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-2 cursor-pointer disabled:opacity-50"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4">Assign Roles to Users</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400">
                                    <th className="p-3 font-medium">User</th>
                                    <th className="p-3 font-medium">Email</th>
                                    <th className="p-3 font-medium">Current Role</th>
                                    <th className="p-3 font-medium">Assign New Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3 text-gray-400">{user.email}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-sm">
                                                {user.roles && user.roles.length > 0 ? roles.find(r => r._id === user.roles[0])?.name || user.role : user.role}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <select 
                                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                                value={user.roles && user.roles.length > 0 ? user.roles[0] : ''}
                                                onChange={(e) => handleAssignRole(user._id, e.target.value)}
                                            >
                                                <option value="" disabled>Select Role</option>
                                                {roles.map(role => (
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
};

export default RBACManager;
