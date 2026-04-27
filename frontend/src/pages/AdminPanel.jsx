import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Filter, CheckCircle, XCircle, MoreVertical, Loader2 } from 'lucide-react';

const AdminPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await api.get(`/admin/requests?search=${search}&status=${statusFilter}`);
            setRequests(res.data.requests);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const handleAction = async (requestId, status) => {
        const adminComments = prompt('Enter comments (optional):');
        try {
            await api.patch(`/admin/requests/${requestId}`, { status, adminComments });
            fetchRequests();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Review and manage access requests</p>
                </div>
                
                <div className="flex" style={{ gap: '16px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                style={{ paddingLeft: '40px', width: '240px' }} 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
                            />
                        </div>
                    </div>
                    <select 
                        style={{ padding: '10px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '16px 24px' }}>User</th>
                            <th style={{ padding: '16px 24px' }}>Requested Role</th>
                            <th style={{ padding: '16px 24px' }}>Score</th>
                            <th style={{ padding: '16px 24px' }}>Status</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No requests found</td></tr>
                        ) : requests.map((req) => (
                            <tr key={req._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ fontWeight: '600' }}>{req.userId.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.userId.email}</div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>{req.requestedRole}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%', 
                                        border: '2px solid var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>
                                        {req.score}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600',
                                        background: req.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: req.status === 'Approved' ? 'var(--success)' : req.status === 'Rejected' ? 'var(--error)' : 'var(--warning)'
                                    }}>
                                        {req.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    {req.status === 'Pending' && (
                                        <div className="flex" style={{ justifyContent: 'flex-end' }}>
                                            <button 
                                                onClick={() => handleAction(req._id, 'Approved')}
                                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: 'none', cursor: 'pointer', color: 'var(--success)' }}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req._id, 'Rejected')}
                                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
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

export default AdminPanel;
