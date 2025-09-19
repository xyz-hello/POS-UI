// src/pages/POSProductList.js
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePOSProducts } from "../../hooks/usePOSProducts";
import ProductCard from "../components/products/ProductCard";
import SearchBarWithToggle from "../components/CommonComponents/SeachBar";
import EmptyState from "../../components/CommonComponents/EmptyState";
import ErrorState from "../../components/CommonComponents/ErrorState";
import { ShoppingCart, WifiOff } from "lucide-react";

// Skeleton loader
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

    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const [massEditMode, setMassEditMode] = useState(false); // toggle edit
    const [massEditQuantities, setMassEditQuantities] = useState({}); // {productId: qty}

    // Filter products by search term
    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Reset grid when search term changes
    useEffect(() => {
        const initialLoad = filteredProducts.slice(0, itemsPerLoad);
        setDisplayProducts(initialLoad);
        setLoadedCount(initialLoad.length);
        setHasMore(initialLoad.length < filteredProducts.length);
    }, [filteredProducts]);

    const loadMoreProducts = () => {
        const nextProducts = filteredProducts.slice(
            loadedCount,
            loadedCount + itemsPerLoad
        );
        setDisplayProducts((prev) => [...prev, ...nextProducts]);
        setLoadedCount((prev) => prev + nextProducts.length);
        if (loadedCount + nextProducts.length >= filteredProducts.length) {
            setHasMore(false);
        }
    };

    const handleAddToCart = (product) => {
        console.log("Added to cart:", product.name);
    };

    const handleToggleView = () => {
        setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    };

    const handleToggleMassEdit = () => {
        setMassEditMode((prev) => !prev);
        if (!massEditMode) {
            // Pre-fill quantities
            const initialQuantities = {};
            products.forEach((p) => {
                initialQuantities[p.id] = 0;
            });
            setMassEditQuantities(initialQuantities);
        }
    };

    const handleQuantityChange = (productId, value) => {
        if (value < 0) value = 0;
        setMassEditQuantities((prev) => ({ ...prev, [productId]: value }));
    };

    if (loading) return <ProductSkeletonGrid count={itemsPerLoad} />;

    if (error)
        return (
            <ErrorState
                icon={WifiOff}
                message={error.message || "Failed to load products. Please check your connection."}
                onRetry={fetchProducts}
            />
        );

    return (
        <div className="relative">
            {/* Search + toggle + edit */}
            <SearchBarWithToggle
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products..."
                viewMode={viewMode}
                onToggle={handleToggleView}
                onEdit={handleToggleMassEdit}
            />

            <InfiniteScroll
                dataLength={displayProducts.length}
                next={loadMoreProducts}
                hasMore={hasMore}
                loader={<ProductSkeletonGrid count={itemsPerLoad} />}
            >
                {/* Product grid/list */}
                <div
                    className={`p-4 ${viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                            : "flex flex-col gap-2"
                        }`}
                >
                    {displayProducts.length > 0 ? (
                        displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                quantity={massEditQuantities[product.id] || 0}
                                onQuantityChange={handleQuantityChange}
                                massEditMode={massEditMode}
                                viewMode={viewMode}
                            />
                        ))
                    ) : (
                        <EmptyState icon={ShoppingCart} message="No products found" />
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
}
