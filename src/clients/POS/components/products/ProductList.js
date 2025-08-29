// src/components/products/ProductList.js
import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { mockProducts } from "./MockData";
import CategoryTabs from "./CategoryTabs";

export default function ProductList() {
    const [products, setProducts] = useState([]); // All products
    const [selectedCategory, setSelectedCategory] = useState("All"); // Active tab
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch mock products
    useEffect(() => {
        setProducts(mockProducts); // Replace with API call later
        setLoading(false);
    }, []);

    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) => selectedCategory === "All" || p.category === selectedCategory
        );
    }, [products, selectedCategory]);

    // Get unique categories + "All"
    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Loading products...</p>;
    }

    return (
        <div className="flex flex-col p-4 pt-20">
            {/* pt-20 = header height + optional spacing to avoid overlap */}

            {/* Category Tabs (Dribbble-style rounded pills, scrollable if overflow) */}
            <CategoryTabs
                categories={categories}            // Array of categories
                selectedCategory={selectedCategory} // Currently selected tab
                onSelectCategory={setSelectedCategory} // Callback to change tab
            />

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6 justify-items-center items-start">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 mt-6">
                        No products found
                    </p>
                )}
            </div>
        </div>
    );
}
