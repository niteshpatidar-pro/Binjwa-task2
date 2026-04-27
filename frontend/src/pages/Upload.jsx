import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, File, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('accessToken', token);
            // In a production app, we would fetch user details here
            // For now, we'll just allow the user to see the upload screen
        }
    }, []);

    const handleUpload = () => {
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        }, 2000);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Upload Documents</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Please upload your KYC documents to proceed</p>

                {!success ? (
                    <div 
                        style={{ 
                            border: '2px dashed var(--glass-border)', 
                            borderRadius: '16px', 
                            padding: '40px', 
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        onClick={handleUpload}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                                <p style={{ color: 'var(--text-primary)' }}>Uploading your files...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <UploadIcon size={48} style={{ color: 'var(--text-muted)' }} />
                                <div>
                                    <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Click to upload files</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>PDF, PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <CheckCircle size={64} style={{ color: 'var(--success)' }} />
                        <h3 style={{ fontSize: '1.5rem' }}>Upload Successful!</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to dashboard...</p>
                    </div>
                )}

                <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px' }}>
                    <File size={20} style={{ color: 'var(--accent-primary)' }} />
                    <div style={{ textAlign: 'left', flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Sample_ID_Proof.pdf</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ready to upload</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
