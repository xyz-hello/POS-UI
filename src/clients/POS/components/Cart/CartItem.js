import React from "react";

export default function CartItem({ item, onQuantityChange, onWeightChange, onRemove, minimal = false }) {
    const totalPrice = (item.price * item.quantity * (item.soldByWeight ? item.weight : 1)).toFixed(2);

    return (
        <div className={`flex justify-between items-center py-2 px-2 ${!minimal ? "bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200" : ""}`}>
            {/* Name & quantity */}
            <div className="flex-1 flex justify-between text-gray-800 text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>₱{totalPrice}</span>
            </div>
        </div>
    );
}
