import axios from 'axios';

// Base URL for user endpoints
const API_URL = 'http://localhost:4000/api/admin/users';

// Get token from local storage
const getToken = () => localStorage.getItem('token');

// Fetch all users
export const fetchUsers = async () => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
};

// Delete a user
export const deleteUser = async (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
};

// Update a user
export const updateUser = async (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
};
