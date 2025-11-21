import React, { useState, useEffect } from 'react';
import { storeAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        loadStores();
    }, [filters]);

    const loadStores = async () => {
        setLoading(true);
        try {
            const response = await storeAPI.getStoresWithRatings(filters);
            setStores(response.data.stores);
        } catch (error) {
            console.error('Error loading stores:', error);
            alert('Error loading stores');
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (storeId, rating) => {
        try {
            await storeAPI.submitRating(storeId, rating);
            loadStores(); // Reload stores to update ratings
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // FIX: Safe function to get rating
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

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Browse Stores</h1>
                <p>Rate your favorite stores and see what others think!</p>
            </div>
            
            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search by store name"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        className="filter-input"
                    />
                </div>
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search by address"
                        value={filters.address}
                        onChange={(e) => handleFilterChange('address', e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading stores...</div>
            ) : (
                <div className="stores-grid">
                    {stores.map(store => {
                        // FIX: Safe rating calculation
                        const averageRating = getSafeRating(store.average_rating);
                        const ratingCount = store.rating_count || 0;
                        
                        return (
                            <div key={store.id} className="store-card">
                                <div className="store-header">
                                    <h3>{store.name}</h3>
                                    <div 
                                        className="overall-rating-badge"
                                        style={{ backgroundColor: getRatingColor(averageRating) }}
                                    >
                                        {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                                    </div>
                                </div>
                                <p className="store-address">{store.address}</p>
                                <div className="store-stats">
                                    <span>{ratingCount} rating{ratingCount !== 1 ? 's' : ''}</span>
                                </div>
                                
                                <div className="rating-section">
                                    <div className="user-rating-info">
                                        <strong>Your Rating:</strong> {store.userRating || 'Not rated yet'}
                                    </div>
                                    <div className="rating-buttons">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                className={`rating-star ${store.userRating === star ? 'active' : ''}`}
                                                onClick={() => handleRating(store.id, star)}
                                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                            >
                                                ⭐
                                                <span>{star}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && stores.length === 0 && (
                <div className="empty-state">
                    <h3>No stores found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            )}
        </div>
    );
};

export default StoreList;