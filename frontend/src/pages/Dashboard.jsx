import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ShieldCheck, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get('/access/status');
                setRequest(res.data.request);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Welcome back, {user.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Account Type: <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{user.role}</span></p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ShieldCheck color="var(--success)" /> Access Status
                    </h3>
                    
                    {loading ? (
                        <p>Loading status...</p>
                    ) : request ? (
                        <div>
                            <div className="flex" style={{ alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: '600',
                                    background: request.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: request.status === 'Approved' ? 'var(--success)' : 'var(--warning)'
                                }}>
                                    {request.status.toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Requested: {request.requestedRole}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Eligibility Score: <span style={{ color: 'var(--text-primary)' }}>{request.score}/100</span>
                            </p>
                            {request.adminComments && (
                                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{request.adminComments}"</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                                You currently have standard user access. Apply for higher privileges to unlock more features.
                            </p>
                            <Link to="/request-access" className="btn btn-primary">
                                Upgrade Account <ChevronRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock color="var(--accent-secondary)" /> Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="flex" style={{ gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                            <p style={{ fontSize: '0.9rem' }}>Logged in from Chrome on Windows</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Just now</span>
                        </div>
                        <div className="flex" style={{ gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>
                            <p style={{ fontSize: '0.9rem' }}>Profile updated</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
