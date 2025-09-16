// filepath: src/components/POS/QuantityControl.js
import React from "react";

// Reusable + / - quantity control component
export default function QuantityControl({ quantity, onIncrease, onDecrease, disabled = false }) {
    return (
        <div className="flex items-center gap-2 mt-3">
            {/* Decrease button */}
            <button
                onClick={onDecrease}
                disabled={disabled || quantity <= 0}
                className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${disabled || quantity <= 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
            >
                -
            </button>

            {/* Quantity display */}
            <span className={`text-sm font-medium ${disabled ? "text-gray-400" : ""}`}>
                {quantity}
            </span>

            {/* Increase button */}
            <button
                onClick={onIncrease}
                disabled={disabled}
                className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${disabled
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-brandGreen hover:bg-green-700 text-white"
                    }`}
            >
                +
            </button>
        </div>
    );
}
