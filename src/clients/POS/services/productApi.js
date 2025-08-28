// src/services/productApi.js
import axios from "axios";

// Create an Axios instance for the POS
const api = axios.create({
    baseURL: "http://localhost:4000/api/pos",
});

// Automatically attach JWT token if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
