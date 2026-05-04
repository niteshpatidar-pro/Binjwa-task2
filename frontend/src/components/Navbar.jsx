import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, LayoutDashboard, Shield, History } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="glass" style={{ margin: '20px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--accent-gradient)', borderRadius: '8px' }}></div>
                BINJWA SOLUTION
            </Link>

            <div className="flex" style={{ alignItems: 'center', gap: '24px' }}>
                {!user ? (
                    <>
                        <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
                        <Link to="/register" className="btn btn-primary">Join Now</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        {user.role === 'Admin' && (
                            <>
                                <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} /> Admin
                                </Link>
                                <Link to="/admin/logs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <History size={18} /> Logs
                                </Link>
                                <Link to="/admin/rbac" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} /> RBAC
                                </Link>
                            </>
                        )}
                        <div className="flex" style={{ alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
