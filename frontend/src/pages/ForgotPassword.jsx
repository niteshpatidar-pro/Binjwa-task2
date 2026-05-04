import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || 'Password reset link sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                    Back to login
                </Link>

                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Forgot Password</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Enter your registered email and we will send you a link to reset your password.
                </p>

                {error && <div style={{ color: 'var(--error)', marginBottom: '20px', fontSize: '0.9rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
                
                {message ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
                        <h3 style={{ color: '#10b981', marginBottom: '8px' }}>Email Sent</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
