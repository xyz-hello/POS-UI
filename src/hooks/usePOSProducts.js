import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance"; // your configured axios instance

export const usePOSProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // axiosInstance automatically attaches JWT in headers
                const res = await axiosInstance.get("/pos/products");

                setProducts(res.data); // only products for this customer_id
            } catch (err) {
                console.error("Error fetching POS products:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};
