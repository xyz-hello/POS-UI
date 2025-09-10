import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/cartContext";
import { formatProductPrice } from "../../utils/FormatPrice";
import POSProductImage from "./POSProductImage";
import PriceBadge from "./PriceBadge";
import AddedNotification from "./AddedNotification";
import QuantityControl from "./QuantityControl";

export default function ProductCard({ product, onAddToCart }) {
    // Track quantity for this product
    const [quantity, setQuantity] = useState(0);

    // Track card focus state (visual ring effect)
    const [selected, setSelected] = useState(false);

    // Track whether "Added!" feedback should show
    const [added, setAdded] = useState(false);

    const cardRef = useRef(null);
    const { addToCart } = useCart();

    // Close selection if clicked outside card
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setSelected(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle + button
    const handleIncrease = () => {
        addToCart(product);
        if (onAddToCart) onAddToCart(product);

        setQuantity((q) => q + 1);
        setSelected(true);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    // Handle - button
    const handleDecrease = () => {
        if (quantity > 0) {
            setQuantity((q) => q - 1);
            // TODO: add removeFromCart(product) later when backend is ready
        }
    };

    return (
        <div
            ref={cardRef}
            className={`p-3 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 ${selected ? "ring-2 ring-brandGreen" : ""
                }`}
        >
            {/* Product Image + Price */}
            <div className="relative w-full mb-3 bg-gray-50 rounded-lg p-2">
                <POSProductImage imageUrl={product.image} name={product.name} />
                <PriceBadge price={formatProductPrice(product)} />

                <AnimatePresence>
                    {added && <AddedNotification />}
                </AnimatePresence>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-center truncate w-full">
                {product.name}
            </h3>

            {/* Quantity Controls */}
            <QuantityControl
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
            />
        </div>
    );
}
