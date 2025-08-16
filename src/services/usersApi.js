// api/userApi.js
import axios from 'axios';

// Create axios instance with base settings
const api = axios.create({
    baseURL: 'http://localhost:4000/api/admin/users',
});

// Attach token automatically before requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Get all users
export const fetchUsers = () => api.get('/');

// Delete a specific user
export const deleteUser = (id) => api.delete(`/${id}`);

// Update a specific user
export const updateUser = (id, data) => api.put(`/${id}`, data);
