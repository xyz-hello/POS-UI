import React from "react";
import ProductCard from "./ProductCard"; // each product card
import { mockProducts } from "./MockData"; //replace with real API soon

export default function ProductList() {
    return (
        <div className="p-4">
            {/* Search & filter section */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="border p-2 rounded-md w-1/3"
                />
                <select className="border p-2 rounded-md">
                    <option>All Categories</option>
                    <option>Breads</option>
                    <option>Pastries</option>
                    <option>Cakes</option>
                </select>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
