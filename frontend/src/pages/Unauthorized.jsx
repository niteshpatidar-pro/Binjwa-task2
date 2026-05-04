import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                <ShieldAlert size={64} color="var(--error)" style={{ margin: '0 auto 20px auto' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>403 - Access Denied</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    You do not have the required permissions to view this page.
                </p>
                <Link to="/dashboard" className="btn btn-primary">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
