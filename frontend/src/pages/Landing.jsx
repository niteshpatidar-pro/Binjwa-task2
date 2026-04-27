import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, BarChart } from 'lucide-react';

const Landing = () => {
    return (
        <div className="landing-page">
            <header className="hero" style={{ padding: '120px 0 80px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '4rem', marginBottom: '24px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        API-Driven Workflow Excellence
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px' }}>
                        Secure authentication, dynamic role-based qualification, and real-time insights for your enterprise ecosystem.
                    </p>
                    <div className="flex" style={{ justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                            Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                            Learn More
                        </Link>
                    </div>
                </div>
            </header>

            <section className="features" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        <div className="glass" style={{ padding: '32px' }}>
                            <Shield size={40} color="var(--accent-primary)" style={{ marginBottom: '20px' }} />
                            <h3>Secure Identity</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                                JWT-based auth with OAuth, OTP verification, and RBAC support.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '32px' }}>
                            <Zap size={40} color="var(--accent-secondary)" style={{ marginBottom: '20px' }} />
                            <h3>Smart Qualification</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                                Dynamic forms with rule-based scoring for instant eligibility checks.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '32px' }}>
                            <BarChart size={40} color="#10b981" style={{ marginBottom: '20px' }} />
                            <h3>Audit & Analytics</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                                Complete visibility with audit logs and admin-led approval workflows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
