import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user, updatePassword } = useAuth();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16 || 
            !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(passwordData.newPassword)) {
            setError('New password must be 8-16 characters with at least one uppercase letter and one special character');
            return;
        }

        setLoading(true);
        try {
            await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setError(error.response?.data?.error || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>User Profile</h1>
            </div>

            <div className="profile-section">
                <div className="profile-card">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <div className="info-row">
                            <label>Name:</label>
                            <span>{user.name}</span>
                        </div>
                        <div className="info-row">
                            <label>Email:</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="info-row">
                            <label>Address:</label>
                            <span>{user.address}</span>
                        </div>
                        <div className="info-row">
                            <label>Role:</label>
                            <span className="role-badge">{user.role}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card">
                    <h2>Change Password</h2>
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Current Password:</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;