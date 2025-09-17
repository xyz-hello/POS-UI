// filepath: src/services/orderApi.js
import axiosInstance from "./axiosInstance";

/**
 * Create a new order
 * @param {Object} orderData - { user_id, cart, payment_method, discount }
 * @returns {Promise<Object>} - { order_number, id, ...other order data }
 */
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post("/admin/orders", orderData);

        // Ensure we return order_number for PaymentPanel
        const { order } = response.data;
        return { order_number: order.order_number, id: order.id, ...order };
    } catch (error) {
        console.error("Order API error:", error.response?.data || error.message);
        throw error;
    }
};
