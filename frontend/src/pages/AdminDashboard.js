import React, { useState, useEffect } from 'react';
import { adminAPI, storeAPI } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [filters, setFilters] = useState({});
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
    });
    const [newStore, setNewStore] = useState({
        name: '',
        email: '',
        address: '',
        owner_id: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'stores') {
            loadStores();
        }
    }, [activeTab, filters]);

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await adminAPI.getAllUsers(filters);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadStores = async () => {
        try {
            const response = await storeAPI.getAllStores(filters);
            setStores(response.data.stores);
        } catch (error) {
            console.error('Error loading stores:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminAPI.createUser(newUser);
            setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
            loadUsers();
            alert('User created successfully');
        } catch (error) {
            alert(error.response?.data?.error || 'Error creating user');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminAPI.createStore(newStore);
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
            loadStores();
            alert('Store created successfully');
        } catch (error) {
            alert(error.response?.data?.error || 'Error creating store');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            admin: '#f44336',
            store_owner: '#2196f3',
            user: '#4caf50'
        };
        return (
            <span 
                className="role-badge"
                style={{ backgroundColor: roleColors[role] }}
            >
                {role}
            </span>
        );
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users, stores, and platform statistics</p>
            </div>
            
            <div className="tabs">
                <button 
                    className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users
                </button>
                <button 
                    className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stores')}
                >
                    🏪 Stores
                </button>
            </div>

            {activeTab === 'dashboard' && (
                <div className="dashboard-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <h3>Total Users</h3>
                                <p className="stat-number">{stats.totalUsers || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏪</div>
                            <div className="stat-info">
                                <h3>Total Stores</h3>
                                <p className="stat-number">{stats.totalStores || 0}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <h3>Total Ratings</h3>
                                <p className="stat-number">{stats.totalRatings || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="users-section">
                    <div className="section-header">
                        <h2>User Management</h2>
                    </div>
                    
                    <div className="create-form">
                        <h3>Create New User</h3>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    required
                                />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="user">Normal User</option>
                                    <option value="store_owner">Store Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Address"
                                value={newUser.address}
                                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>

                    <div className="filters-section">
                        <h3>Filter Users</h3>
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Filter by name"
                                onChange={(e) => setFilters({...filters, name: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Filter by email"
                                onChange={(e) => setFilters({...filters, email: e.target.value})}
                            />
                            <select
                                onChange={(e) => setFilters({...filters, role: e.target.value})}
                            >
                                <option value="">All Roles</option>
                                <option value="user">User</option>
                                <option value="store_owner">Store Owner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="address-cell">{user.address}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'stores' && (
                <div className="stores-section">
                    <div className="section-header">
                        <h2>Store Management</h2>
                    </div>
                    
                    <div className="create-form">
                        <h3>Create New Store</h3>
                        <form onSubmit={handleCreateStore}>
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Store Name"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Store Email"
                                    value={newStore.email}
                                    onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <textarea
                                    placeholder="Store Address"
                                    value={newStore.address}
                                    onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Owner User ID"
                                    value={newStore.owner_id}
                                    onChange={(e) => setNewStore({...newStore, owner_id: e.target.value})}
                                />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Store'}
                            </button>
                        </form>
                    </div>

                    <div className="filters-section">
                        <h3>Filter Stores</h3>
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Filter by store name"
                                onChange={(e) => setFilters({...filters, name: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Filter by address"
                                onChange={(e) => setFilters({...filters, address: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Rating</th>
                                    <th>Ratings Count</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map(store => (
                                    <tr key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.email}</td>
                                        <td className="address-cell">{store.address}</td>
                                        <td>
                                            <span className="rating-display">
                                                {/* {store.average_rating ? store.average_rating.toFixed(1) : 'N/A'} */}
                                                {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'N/A'}
                                            </span>
                                        </td>
                                        <td>{store.rating_count || 0}</td>
                                        <td>{new Date(store.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;