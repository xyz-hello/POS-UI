import React, { useState } from "react";
import { usePOSProducts } from "../../hooks/usePOSProducts";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/CommonComponents/SeachBar";

export default function POSProductList() {
    const { products, loading, error } = usePOSProducts();
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddToCart = (product) => {
        console.log("Added to cart:", product.name);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10">Loading products...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error.message}</div>;

    return (
        <div className="relative">
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products..."
            />

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}
