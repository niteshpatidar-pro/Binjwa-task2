import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { History, User, Activity, Clock } from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/admin/audit-logs');
                setLogs(res.data.logs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Audit Logs</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>System-wide activity tracking</p>

            <div className="glass" style={{ padding: '24px' }}>
                {loading ? (
                    <p>Loading logs...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {logs.map((log) => (
                            <div key={log._id} style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                gap: '20px',
                                alignItems: 'center'
                            }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '10px', 
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Activity size={20} color="var(--accent-primary)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{log.action}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        By {log.actor?.name} ({log.actor?.email})
                                    </div>
                                    {log.details && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            Details: {JSON.stringify(log.details)}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
