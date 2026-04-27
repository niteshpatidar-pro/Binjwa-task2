import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import RequestAccess from './pages/RequestAccess';
import AuditLogs from './pages/AuditLogs';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

    return children;
};

function AppContent() {
    return (
        <div className="app">
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="/request-access" element={
                    <ProtectedRoute>
                        <RequestAccess />
                    </ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute roles={['Admin']}>
                        <AdminPanel />
                    </ProtectedRoute>
                } />

                <Route path="/admin/logs" element={
                    <ProtectedRoute roles={['Admin']}>
                        <AuditLogs />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
