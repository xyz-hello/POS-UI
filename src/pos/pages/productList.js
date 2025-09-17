import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePOSProducts } from "../../hooks/usePOSProducts";
import ProductCard from "../components/products/ProductCard";
import SearchBar from "../components/CommonComponents/SeachBar";

export default function POSProductList() {
    const { products, loading, error } = usePOSProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [displayProducts, setDisplayProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerLoad = 20;
    const [loadedCount, setLoadedCount] = useState(0);

    // Memoize filtered products so it doesn't change every render
    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Reset displayed products when search changes
    useEffect(() => {
        const initialLoad = filteredProducts.slice(0, itemsPerLoad);
        setDisplayProducts(initialLoad);
        setLoadedCount(initialLoad.length);
        setHasMore(initialLoad.length < filteredProducts.length);
    }, [filteredProducts]); // only re-run when filteredProducts actually changes

    // Load more products for infinite scroll
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

    if (loading)
        return (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: itemsPerLoad }).map((_, idx) => (
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

    if (error)
        return (
            <div className="text-center py-10 text-red-500">{error.message}</div>
        );

    return (
        <div className="relative">
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search products..."
            />

            <InfiniteScroll
                dataLength={displayProducts.length}
                next={loadMoreProducts}
                hasMore={hasMore}
                loader={
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: itemsPerLoad }).map((_, idx) => (
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
                }
                endMessage={
                    <p className="text-center py-4 text-gray-500">No more products</p>
                }
            >
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
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No products found.
                        </div>
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
}
