// This service is only for POS-side product fetching
import axiosInstance from "./axiosInstance"; // this one already attaches JWT

// Fetch POS products (scoped to logged-in customer)
export const getPOSProducts = async () => {
    try {
        const response = await axiosInstance.get("/pos/products");
        return response.data; // should return only products for this customer_id
    } catch (err) {
        console.error("Error fetching POS products:", err.response?.data || err.message);
        throw err;
    }
};
