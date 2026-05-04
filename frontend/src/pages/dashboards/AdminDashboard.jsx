import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Settings, BarChart2, Shield } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        // Fetch users and roles for management
        api.get('/admin/users').then(res => setUsers(res.data.users)).catch(console.error);
        api.get('/rbac/roles').then(res => setRoles(res.data.roles)).catch(console.error);
    }, []);

    const handleRoleChange = async (userId, roleId) => {
        try {
            await api.post('/rbac/users/assign-role', {
                userId,
                roleIds: [roleId]
            });
            // Refresh users
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
            setEditingUserId(null); // Close dropdown
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to assign role');
        }
    };

    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><Shield className="text-blue-500"/> Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2"><Users /> Total Users</h3>
                    <p className="text-3xl mt-2">{users.length}</p>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2"><BarChart2 /> Platform Stats</h3>
                    <p className="text-sm text-gray-400 mt-2">Active sessions: 124</p>
                </div>
                <div className="glass p-6 rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2"><Settings /> System Settings</h3>
                    <p className="text-sm text-gray-400 mt-2">All systems operational</p>
                </div>
            </div>

            <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-gray-800">
                                <td className="p-3">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                        {u.roles && u.roles.length > 0 && typeof u.roles[0] === 'object' ? u.roles[0].name : u.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {editingUserId === u._id ? (
                                        <select 
                                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                            value={u.roles && u.roles.length > 0 && typeof u.roles[0] === 'object' ? u.roles[0]._id : ''}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            onBlur={() => setEditingUserId(null)}
                                            autoFocus
                                        >
                                            <option value="" disabled>Select Role</option>
                                            {roles.map(role => (
                                                <option key={role._id} value={role._id}>{role.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <button 
                                            onClick={() => setEditingUserId(u._id)}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Edit Role
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminDashboard;
