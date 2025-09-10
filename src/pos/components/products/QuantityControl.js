import React from "react";

// Reusable + / - quantity control component
export default function QuantityControl({ quantity, onIncrease, onDecrease }) {
    return (
        <div className="flex items-center gap-2 mt-3">
            <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={onDecrease}
            >
                -
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brandGreen hover:bg-green-700 text-white"
                onClick={onIncrease}
            >
                +
            </button>
        </div>
    );
}
