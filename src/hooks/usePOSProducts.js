import { useState, useEffect } from "react";
import { getPOSProducts } from "../services/posProductServices";

export const usePOSProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getPOSProducts();
                setProducts(data);
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
