import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { mockProducts } from "./MockData";
import CategoryTabs from "./CategoryTabs";
import QuickAddButtons from "./QuickAddButton";
import { useCart } from "../contexts/cartContext";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart(); // correct hook for cart

    // Quick-add callback
    const handleQuickAdd = (item) => {
        addToCart(item); // adds item immediately to cart
    };

    // Fetch mock products
    useEffect(() => {
        setProducts(mockProducts);
        setLoading(false);
    }, []);

    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) => selectedCategory === "All" || p.category === selectedCategory
        );
    }, [products, selectedCategory]);

    // Unique categories
    const categories = [
        "All",
        ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    ];

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Loading products...</p>;
    }

    return (
        <div className="flex flex-col p-4 pt-6">
            {/* Category Tabs */}
            <div className="relative z-10">
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* Quick Add Buttons */}
            <div className="pt-4">
                <QuickAddButtons onQuickAdd={handleQuickAdd} />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 justify-items-center items-start">
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
