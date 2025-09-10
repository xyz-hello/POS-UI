import { useState, useEffect } from "react";
import axios from "axios";

export const usePOSProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:4000/api/pos/products");
                setProducts(res.data);
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
