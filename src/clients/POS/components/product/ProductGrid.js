import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], onAdd }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => onAdd(product)} />
            ))}
        </div>
    );
}
