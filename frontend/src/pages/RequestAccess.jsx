import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, TrendingUp, Users, CheckCircle, Loader2 } from 'lucide-react';

const RequestAccess = () => {
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/access/request', { requestedRole: role, formData });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
                <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
                <h2 style={{ fontSize: '2.5rem' }}>Application Submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Our team will review your request and get back to you shortly.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '48px' }}>
                <h2 style={{ fontSize: '2.25rem', marginBottom: '12px' }}>Request Access</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Select a role and fill out the eligibility form.</p>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '40px' }}>
                    {[
                        { id: 'Investor', icon: TrendingUp, desc: 'Individual or Institutional' },
                        { id: 'Founder', icon: Briefcase, desc: 'Startup or Business' },
                        { id: 'Partner', icon: Users, desc: 'Ecosystem Partner' }
                    ].map((r) => (
                        <div 
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            style={{ 
                                padding: '24px', 
                                textAlign: 'center', 
                                cursor: 'pointer',
                                border: '2px solid',
                                borderColor: role === r.id ? 'var(--accent-primary)' : 'var(--glass-border)',
                                borderRadius: '16px',
                                background: role === r.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <r.icon size={32} color={role === r.id ? 'var(--accent-primary)' : 'var(--text-muted)'} style={{ marginBottom: '12px' }} />
                            <h4 style={{ color: role === r.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{r.id}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{r.desc}</p>
                        </div>
                    ))}
                </div>

                {role && (
                    <form onSubmit={handleSubmit} className="animate-fade-in">
                        {role === 'Investor' && (
                            <>
                                <div className="input-group">
                                    <label>Net Worth (USD)</label>
                                    <input type="number" name="netWorth" onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Experience (Years)</label>
                                    <input type="number" name="experienceYears" onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Previous Investments</label>
                                    <input type="number" name="previousInvestments" onChange={handleInputChange} required />
                                </div>
                            </>
                        )}

                        {role === 'Founder' && (
                            <>
                                <div className="input-group">
                                    <label>Annual Revenue (USD)</label>
                                    <input type="number" name="revenue" onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Team Size</label>
                                    <input type="number" name="teamSize" onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Industry Experience (Years)</label>
                                    <input type="number" name="industryExperience" onChange={handleInputChange} required />
                                </div>
                            </>
                        )}

                        {role === 'Partner' && (
                            <>
                                <div className="input-group">
                                    <label>Company Size</label>
                                    <input type="number" name="companySize" onChange={handleInputChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Years in Operation</label>
                                    <input type="number" name="yearsInOperation" onChange={handleInputChange} required />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RequestAccess;
