import React from 'react';

export default function QuantityControls({ quantity, onIncrease, onDecrease, onReset }) {
    return (
        <div className="flex items-center justify-center mt-2 gap-2">
            <button
                onClick={onDecrease}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
                -
            </button>
            <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
            <button
                onClick={onIncrease}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
                +
            </button>
        </div>
    );
}
