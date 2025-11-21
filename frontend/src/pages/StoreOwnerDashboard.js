import React, { useState, useEffect } from 'react';
import { storeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StoreOwnerDashboard = () => {
    const [storeRatings, setStoreRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [storeInfo, setStoreInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadStoreData();
    }, []);

    const loadStoreData = async () => {
        try {
            // Get stores owned by this user
            const storesResponse = await storeAPI.getAllStores();
            const userStores = storesResponse.data.stores.filter(store => store.owner_id === user.id);
            
            if (userStores.length > 0) {
                const store = userStores[0];
                setStoreInfo(store);
                
                // FIX: Handle null average_rating
                const avgRating = store.average_rating ? parseFloat(store.average_rating) : 0;
                setAverageRating(avgRating);
                
                // Load ratings for this store
                const ratingsResponse = await storeAPI.getStoreRatings(store.id);
                setStoreRatings(ratingsResponse.data.ratings);
            }
        } catch (error) {
            console.error('Error loading store data:', error);
        } finally {
            setLoading(false);
        }
    };

    // FIX: Safe function to handle ratings
    const getSafeRating = (rating) => {
        if (rating === null || rating === undefined) return 0;
        return typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    };

    const getRatingColor = (rating) => {
        const safeRating = getSafeRating(rating);
        if (safeRating >= 4) return '#4CAF50';
        if (safeRating >= 3) return '#FFC107';
        return '#F44336';
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading your store data...</div>
            </div>
        );
    }

    if (!storeInfo) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <h2>No Store Found</h2>
                    <p>You don't own any stores yet. Contact an administrator to get a store assigned to you.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Store Dashboard</h1>
                <p>Manage and monitor your store's ratings</p>
            </div>

            <div className="store-overview">
                <div className="store-card-large">
                    <div className="store-header">
                        <h2>{storeInfo.name}</h2>
                        <div 
                            className="average-rating-large"
                            style={{ backgroundColor: getRatingColor(averageRating) }}
                        >
                            {/* FIX: Safe rating display */}
                            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                        </div>
                    </div>
                    <div className="store-details">
                        <p><strong>Email:</strong> {storeInfo.email}</p>
                        <p><strong>Address:</strong> {storeInfo.address}</p>
                        <p><strong>Total Ratings:</strong> {storeRatings.length}</p>
                    </div>
                </div>
            </div>

            <div className="ratings-section">
                <h2>Customer Ratings</h2>
                {storeRatings.length === 0 ? (
                    <div className="empty-state">
                        <h3>No ratings yet</h3>
                        <p>Your store hasn't received any ratings yet.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {storeRatings.map(rating => (
                                    <tr key={rating.id || `${rating.user_id}-${rating.created_at}`}>
                                        <td>{rating.name}</td>
                                        <td>{rating.email}</td>
                                        <td>
                                            <span 
                                                className="rating-badge"
                                                style={{ backgroundColor: getRatingColor(rating.rating) }}
                                            >
                                                {rating.rating} ⭐
                                            </span>
                                        </td>
                                        <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;