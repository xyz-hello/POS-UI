// src/pos/pages/POSProductList.js
import React from "react";
import { usePOSProducts } from "../../hooks/usePOSProducts";
import ProductCard from "../components/products/ProductCard";

export default function POSProductList() {
    const { products, loading, error } = usePOSProducts();

    const handleAddToCart = (product) => {
        console.log("Added to cart:", product.name);
    };

    if (loading) return <div className="text-center py-10">Loading products...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error.message}</div>;

    return (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
}
