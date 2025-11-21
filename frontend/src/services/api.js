import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) => api.post('/register', userData),
    login: (credentials) => api.post('/login', credentials),
    getProfile: () => api.get('/profile'),
    updatePassword: (passwordData) => api.put('/update-password', passwordData),
};

export const storeAPI = {
    getAllStores: (filters = {}) => api.get('/stores', { params: filters }),
    getStoresWithRatings: (filters = {}) => api.get('/stores-with-ratings', { params: filters }),
    submitRating: (storeId, rating) => api.post(`/stores/${storeId}/rate`, { rating }),
    getStoreRatings: (storeId) => api.get(`/stores/${storeId}/ratings`),
};

export const adminAPI = {
    createUser: (userData) => api.post('/admin/users', userData),
    getAllUsers: (filters = {}) => api.get('/admin/users', { params: filters }),
    getStats: () => api.get('/admin/stats'),
    getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
    createStore: (storeData) => api.post('/admin/stores', storeData),
};

export default api;