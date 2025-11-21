import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <nav className="navigation">
            <div className="nav-brand">
                <Link to="/">🏪 Store Ratings</Link>
            </div>
            
            <div className="nav-links">
                {user.role === 'admin' && (
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                )}
                {user.role === 'store_owner' && (
                    <Link to="/store-owner/dashboard">My Store</Link>
                )}
                {user.role === 'user' && (
                    <Link to="/stores">Browse Stores</Link>
                )}
                
                <span className="user-info">
                    Welcome, {user.name} ({user.role})
                </span>
                
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navigation;