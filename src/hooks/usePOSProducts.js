// src/hooks/usePOSProducts.js
import { useState, useEffect, useCallback } from "react";
import { getPOSProducts } from "../services/posProductServices";

export const usePOSProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getPOSProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching POS products:", err);

            if (err.response) {
                setError(`Server error: ${err.response.status} ${err.response.statusText}`);
            } else if (err.request) {
                setError("Network error: Please check your connection.");
            } else {
                setError("Unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, fetchProducts };
};
