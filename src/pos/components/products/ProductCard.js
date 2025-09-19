// src/components/POS/ProductCard.js
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../contexts/cartContext";
import { formatProductPrice } from "../../utils/FormatPrice";
import POSProductImage from "./POSProductImage";
import PriceBadge from "./PriceBadge";
import QuantityControl from "./QuantityControl";

export default function ProductCard({
    product,
    quantity,            // new prop for mass edit
    onQuantityChange,    // new prop for mass edit
    massEditMode,        // toggle input
    onAddToCart,
    viewMode
}) {
    const [selected, setSelected] = useState(false);
    const cardRef = useRef(null);
    const { addToCart, removeFromCart, getItemQuantity, cart } = useCart();

    const currentCartQty = getItemQuantity(product.id);
    const remainingStock = product.stock - currentCartQty;
    const isOutOfStock = remainingStock <= 0;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) setSelected(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleIncrease = () => {
        if (!isOutOfStock) {
            addToCart(product);
            if (onAddToCart) onAddToCart(product);
            setSelected(true);
        }
    };

    const handleDecrease = () => {
        if (currentCartQty > 0) {
            const cartItem = cart.find(item => item.productId === product.id);
            if (cartItem) removeFromCart(cartItem.lineId);
        }
    };

    return (
        <div
            ref={cardRef}
            className={`p-3 rounded-xl border shadow-sm flex flex-col items-center transition-transform duration-200
                ${selected && !isOutOfStock ? "ring-2 ring-brandGreen" : ""}
                ${isOutOfStock
                    ? "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:scale-105 cursor-pointer"
                }
            `}
        >
            {/* Image + Price */}
            <div className="relative w-full mb-3 bg-gray-50 rounded-lg p-2">
                <POSProductImage imageUrl={product.image} name={product.name} />
                <PriceBadge price={formatProductPrice(product)} />
            </div>

            {/* Name & description */}
            <h3 className="text-sm font-semibold text-center truncate w-full">{product.name}</h3>
            {product.description && (
                <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2 w-full">{product.description}</p>
            )}

            {/* Mass edit mode input */}
            {massEditMode ? (
                <div className="flex items-center space-x-2 mt-2">
                    <button
                        onClick={() => onQuantityChange(product.id, quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="w-16 text-center border rounded"
                        value={quantity}
                        onChange={(e) => onQuantityChange(product.id, Number(e.target.value))}
                    />
                    <button
                        onClick={() => onQuantityChange(product.id, quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                    >
                        +
                    </button>
                </div>
            ) : (
                !isOutOfStock && (
                    <QuantityControl
                        quantity={currentCartQty}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        maxStock={product.stock}
                    />
                )
            )}

            {isOutOfStock && !massEditMode && (
                <span className="mt-3 text-xs font-medium text-red-500">Out of Stock</span>
            )}
        </div>
    );
}
