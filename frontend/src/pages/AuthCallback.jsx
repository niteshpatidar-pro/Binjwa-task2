import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userDataEncoded = searchParams.get('user');

        console.log('--- AuthCallback Debug ---');
        console.log('Token exists:', !!token);
        console.log('User data exists:', !!userDataEncoded);

        if (token && userDataEncoded) {
            try {
                const userDataDecoded = decodeURIComponent(userDataEncoded);
                console.log('Decoded user data string:', userDataDecoded);
                
                const user = JSON.parse(userDataDecoded);
                console.log('Parsed user object:', user);

                localStorage.setItem('accessToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                
                console.log('Authentication successful, navigating to dashboard...');
                navigate('/dashboard', { replace: true });
            } catch (err) {
                console.error('OAuth Callback Error - Parsing failed:', err);
                navigate('/login?error=OAuthFailed', { replace: true });
            }
        } else {
            console.error('OAuth Callback Error - Missing parameters in URL:', window.location.href);
            navigate('/login?error=OAuthFailed', { replace: true });
        }
    }, [searchParams, navigate, setUser]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-primary)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.25rem' }}>Finalizing sign-in...</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>One moment while we verify your session.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
