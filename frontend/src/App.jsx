import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import AuthCallback from './pages/AuthCallback';
import RequestAccess from './pages/RequestAccess';
import AuditLogs from './pages/AuditLogs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RBACManager from './pages/RBACManager';

import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import InvestorDashboard from './pages/dashboards/InvestorDashboard';
import FounderDashboard from './pages/dashboards/FounderDashboard';
import AnalystDashboard from './pages/dashboards/AnalystDashboard';
import UserDashboard from './pages/dashboards/UserDashboard';

const DashboardRouter = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            switch(user.role) {
                case 'Admin':
                    navigate('/dashboard/admin', { replace: true });
                    break;
                case 'Investor':
                    navigate('/dashboard/investor', { replace: true });
                    break;
                case 'Founder':
                    navigate('/dashboard/founder', { replace: true });
                    break;
                case 'Analyst':
                    navigate('/dashboard/analyst', { replace: true });
                    break;
                case 'User':
                    navigate('/dashboard/welcome', { replace: true });
                    break;
                default:
                    navigate('/unauthorized', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    return <div className="flex justify-center p-8">Loading dashboard...</div>;
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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Dynamic Role-Based Dashboard Router */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardRouter />
                    </PrivateRoute>
                } />

                {/* Specific Role Dashboards */}
                <Route path="/dashboard/admin" element={
                    <PrivateRoute allowedRoles={['Admin']}>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard/investor" element={
                    <PrivateRoute allowedRoles={['Investor']}>
                        <InvestorDashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard/founder" element={
                    <PrivateRoute allowedRoles={['Founder']}>
                        <FounderDashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard/analyst" element={
                    <PrivateRoute allowedRoles={['Analyst']}>
                        <AnalystDashboard />
                    </PrivateRoute>
                } />
                <Route path="/dashboard/welcome" element={
                    <PrivateRoute allowedRoles={['User']}>
                        <UserDashboard />
                    </PrivateRoute>
                } />
                
                <Route path="/request-access" element={
                    <PrivateRoute>
                        <RequestAccess />
                    </PrivateRoute>
                } />

                {/* Other Admin Routes */}
                <Route path="/admin/logs" element={
                    <PrivateRoute allowedRoles={['Admin']}>
                        <AuditLogs />
                    </PrivateRoute>
                } />

                <Route path="/admin/rbac" element={
                    <PrivateRoute allowedRoles={['Admin']}>
                        <RBACManager />
                    </PrivateRoute>
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
