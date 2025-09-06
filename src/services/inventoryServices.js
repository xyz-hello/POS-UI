// filepath: src/services/inventoryServices.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api/admin",
});

/**
 * Fetch all products with inventory
 */
export const getInventory = async (token) => {
    if (!token) throw new Error("JWT token missing.");

    try {
        const response = await api.get("/inventory", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error("Error fetching inventory:", err.response?.data || err.message);
        throw err;
    }
};

/**
 * Update inventory quantity
 */
export const updateInventory = async (productId, quantityChange, token) => {
    if (!token) throw new Error("JWT token missing.");

    try {
        const response = await api.put(
            `/inventory/${productId}`,
            { quantityChange },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
    } catch (err) {
        console.error("Error updating inventory:", err.response?.data || err.message);
        throw err;
    }
};
