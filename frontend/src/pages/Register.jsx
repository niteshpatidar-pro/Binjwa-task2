import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '' });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/register-otp', { email: formData.email });
            if (response.data.success) {
                setOtpSent(true);
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', { ...formData, otp });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Join Us</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Start your journey today</p>

                                {error && (
                    <div style={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid var(--error)', 
                        color: 'var(--error)', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        marginBottom: '20px', 
                        fontSize: '0.85rem',
                        lineHeight: '1.4'
                    }}>
                        <strong>Error:</strong> {error}
                        {error.includes('OTP') && <div style={{ marginTop: '4px', fontSize: '0.75rem', opacity: 0.8 }}>Please check if EMAIL_USER and EMAIL_PASS are configured in the .env file.</div>}
                    </div>
                )}

                {!otpSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="text" 
                                    placeholder="John Doe" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="tel" 
                                    placeholder="+1 (555) 000-0000" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    style={{ paddingLeft: '48px' }} 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Register'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                            We've sent a 6-digit code to <strong>{formData.email}</strong>. Please enter it below to verify your account.
                        </p>
                        <div className="input-group">
                            <label>OTP Code</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Enter 6-digit OTP" 
                                    style={{ paddingLeft: '48px', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }} 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify & Create Account'}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn" 
                            style={{ width: '100%', marginTop: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} 
                            onClick={() => setOtpSent(false)}
                            disabled={loading}
                        >
                            Back to Registration
                        </button>
                    </form>
                )}

                <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>

                <button 
                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    className="btn btn-secondary" 
                    style={{ 
                        width: '100%', 
                        background: 'white', 
                        color: '#333', 
                        border: '1px solid #ddd' 
                    }}
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px' }} />
                    Continue with Google
                </button>

                <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
