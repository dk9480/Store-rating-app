import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreList from './pages/StoreList';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Profile from './pages/Profile';
import './styles/global.css';

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-full">Loading...</div>;
    }

    const getDefaultRoute = () => {
        if (!user) return '/login';
        
        switch (user.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'store_owner':
                return '/store-owner/dashboard';
            default:
                return '/stores';
        }
    };

    return (
        <Router>
            <Navigation />
            <main className="main-content">
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={!user ? <Login /> : <Navigate to={getDefaultRoute()} />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to={getDefaultRoute()} />} />
                    
                    {/* Protected routes */}
                    <Route path="/stores" element={
                        <PrivateRoute>
                            <StoreList />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/admin/dashboard" element={
                        <PrivateRoute requiredRole="admin">
                            <AdminDashboard />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/store-owner/dashboard" element={
                        <PrivateRoute requiredRole="store_owner">
                            <StoreOwnerDashboard />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    
                    {/* Default route */}
                    <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
                    
                    {/* 404 route */}
                    <Route path="*" element={<div className="page-container"><h2>404 - Page Not Found</h2></div>} />
                </Routes>
            </main>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;