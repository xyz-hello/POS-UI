// filepath: src/services/axiosInstance.js
import axios from "axios";

// Create a single reusable axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api", // backend API root
});

// Interceptor: automatically attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
