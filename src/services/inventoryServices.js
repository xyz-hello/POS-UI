// filepath: src/services/inventoryServices.js
import axios from "axios";

// Same axios instance for consistency
const api = axios.create({
    baseURL: "http://localhost:4000/api/admin",
});

// Update inventory quantity for a product
export const updateInventory = async (productId, quantity) => {
    try {
        const response = await api.patch(`/products/${productId}/inventory`, { quantity });
        return response.data;
    } catch (err) {
        console.error("Error updating inventory:", err.response?.data || err.message);
        throw err;
    }
};
