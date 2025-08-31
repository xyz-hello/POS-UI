import React, { useState, useEffect, useRef } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import { useCart } from "../contexts/cartContext";

export default function ProductCard({ product }) {
    const [selected, setSelected] = useState(false);
    const cardRef = useRef(null);
    const { addToCart } = useCart();

    // Deselect if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setSelected(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAddToCart = () => {
        addToCart(product);
        setSelected(true);
    };

    return (
        <div
            ref={cardRef}
            className={`p-3 rounded-xl bg-white border border-gray-200 shadow-sm 
                        flex flex-col items-center cursor-pointer 
                        transition-transform duration-200 hover:scale-105
                        ${selected ? "ring-2 ring-brandGreen" : ""}`}
        >
            {/* Product Image with Price Badge */}
            <div className="relative w-full mb-3 bg-gray-50 rounded-lg p-2">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover rounded-lg"
                />
                <span className="absolute top-2 right-2 bg-brandGreen text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                    {formatPrice(product.price)}
                </span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-center truncate w-full">{product.name}</h3>

            {/* Add Button */}
            <button
                onClick={handleAddToCart}
                className={`mt-3 w-full py-2 rounded-full bg-brandGreen text-white text-sm font-medium
                            hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-brandGreen transition-colors`}
            >
                Add
            </button>
        </div>
    );
}
