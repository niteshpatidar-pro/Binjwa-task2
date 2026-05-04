import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        if (!token) {
            return setError('Invalid or missing token');
        }

        setLoading(true);

        try {
            await api.post('/auth/reset-password', { 
                token, 
                newPassword: password 
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token && !success) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--error)' }}>Invalid Request</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Password reset token is missing.</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%' }}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Reset Password</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Please enter your new password below.
                </p>

                {error && <div style={{ color: 'var(--error)', marginBottom: '20px', fontSize: '0.9rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
                
                {success ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
                        <h3 style={{ color: '#10b981', marginBottom: '8px' }}>Password Reset Successful</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
                            Your password has been successfully reset. Redirecting to login...
                        </p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%' }}>
                            Go to Login Now
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
