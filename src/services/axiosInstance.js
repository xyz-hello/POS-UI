// src/api/axiosInstance.js
import axios from "axios";

// Create a single axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api",
});

// Automatically add token to headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
