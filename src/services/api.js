import axios from 'axios';

// Base API URL for admin users
const API_URL = 'http://localhost:4000/api/admin/users';

// Retrieve stored JWT token
const getToken = () => localStorage.getItem('token');

// Get all users
export const fetchUsers = async () => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Delete a specific user
export const deleteUser = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

// Update a specific user
export const updateUser = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
