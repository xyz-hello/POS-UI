// filepath: src/components/POS/ProductCard.js
import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../contexts/cartContext";
import { formatProductPrice } from "../../utils/FormatPrice";
import POSProductImage from "./POSProductImage";
import PriceBadge from "./PriceBadge";
import QuantityControl from "./QuantityControl";

export default function ProductCard({ product, onAddToCart }) {
    const [selected, setSelected] = useState(false); // highlight when selected
    const cardRef = useRef(null);

    const { addToCart, removeFromCart, getItemQuantity, cart } = useCart();

    // Quantity already in cart
    const quantity = getItemQuantity(product.id);

    // Remaining stock = total stock - quantity in cart
    const remainingStock = product.stock - quantity;

    // Out of stock condition (no items left to sell)
    const isOutOfStock = remainingStock <= 0;

    // Close selection when clicking outside the card
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setSelected(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Increase quantity (add to cart)
    const handleIncrease = () => {
        if (!isOutOfStock) {
            addToCart(product);
            if (onAddToCart) onAddToCart(product);
            setSelected(true);
        }
    };

    // Decrease quantity (remove from cart)
    const handleDecrease = () => {
        if (quantity > 0) {
            const cartItem = cart.find(item => item.productId === product.id);
            if (cartItem) {
                removeFromCart(cartItem.lineId); // remove one quantity
            }
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
            {/* Product Image + Price */}
            <div className="relative w-full mb-3 bg-gray-50 rounded-lg p-2">
                <POSProductImage imageUrl={product.image} name={product.name} />
                <PriceBadge price={formatProductPrice(product)} />
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-center truncate w-full">
                {product.name}
            </h3>

            {/* Product Description */}
            {product.description && (
                <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2 w-full">
                    {product.description}
                </p>
            )}

            {/* Show quantity controls only if in stock */}
            {!isOutOfStock ? (
                <QuantityControl
                    quantity={quantity}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    maxStock={product.stock}
                />
            ) : (
                <span className="mt-3 text-xs font-medium text-red-500">
                    Out of Stock
                </span>
            )}
        </div>
    );
}
