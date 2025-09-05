// filepath: src/services/productServices.js
import axios from "axios";

// Create an axios instance with backend base URL
const api = axios.create({
    baseURL: "http://localhost:4000/api/admin", // adjust if your backend port or path differs
});

// Fetch all products
export const getProducts = async () => {
    try {
        const response = await api.get("/products");
        return response.data;
    } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
        throw err;
    }
};

// Create a new product
export const createProduct = async (formData) => {
    try {
        const response = await api.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" }, // for image upload
        });
        return response.data;
    } catch (err) {
        console.error("Error creating product:", err.response?.data || err.message);
        throw err;
    }
};

// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (err) {
        console.error("Error deleting product:", err.response?.data || err.message);
        throw err;
    }
};
