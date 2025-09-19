// src/pages/POSProductList.js
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePOSProducts } from "../../hooks/usePOSProducts";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/CommonComponents/SeachBar";
import EmptyState from "../../components/CommonComponents/EmptyState";
import ErrorState from "../../components/CommonComponents/ErrorState";
import { ShoppingCart, WifiOff } from "lucide-react";

// Reusable skeleton loader for product cards
const ProductSkeletonGrid = ({ count }) => (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
            <div
                key={idx}
                className="bg-white rounded-lg shadow-sm p-3 flex flex-col animate-pulse"
            >
                <div className="bg-gray-200 h-32 sm:h-36 md:h-40 lg:h-44 rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-3 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
            </div>
        ))}
    </div>
);

export default function POSProductList() {
    const { products, loading, error, fetchProducts } = usePOSProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [displayProducts, setDisplayProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerLoad = 20;
    const [loadedCount, setLoadedCount] = useState(0);

    // Filter products by search term
    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Reset grid when search term changes
    useEffect(() => {
        const initialLoad = filteredProducts.slice(0, itemsPerLoad);
        setDisplayProducts(initialLoad);
        setLoadedCount(initialLoad.length);
        setHasMore(initialLoad.length < filteredProducts.length); // stop if fewer items
    }, [filteredProducts]);

    // Load more products for infinite scroll
    const loadMoreProducts = () => {
        const nextProducts = filteredProducts.slice(
            loadedCount,
            loadedCount + itemsPerLoad
        );
        setDisplayProducts((prev) => [...prev, ...nextProducts]);
        setLoadedCount((prev) => prev + nextProducts.length);

        // Stop loading if we've reached the end
        if (loadedCount + nextProducts.length >= filteredProducts.length) {
            setHasMore(false);
        }
    };

    // Handle add-to-cart action
    const handleAddToCart = (product) => {
        console.log("Added to cart:", product.name);
    };

    // Show skeleton loader while fetching
    if (loading) {
        return <ProductSkeletonGrid count={itemsPerLoad} />;
    }

    // Show error state if fetch failed
    if (error) {
        return (
            <ErrorState
                icon={WifiOff}
                message={error.message || "Failed to load products. Please check your connection."}
                onRetry={fetchProducts} // retry using hook instead of reload
            />
        );
    }

    return (
        <div className="relative">
            {/* Product search bar */}
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products..."
            />

            <InfiniteScroll
                dataLength={displayProducts.length}
                next={loadMoreProducts}
                hasMore={hasMore}
                loader={<ProductSkeletonGrid count={itemsPerLoad} />}
            >
                {/* Product grid */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {displayProducts.length > 0 ? (
                        displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <EmptyState
                            icon={ShoppingCart}
                            message="No products found"
                        />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
}
