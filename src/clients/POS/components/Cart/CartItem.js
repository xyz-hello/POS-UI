import React from "react";

export default function CartItem({ item, onQuantityChange, onWeightChange, onRemove }) {
    return (
        <div className="flex justify-between items-center p-3 border-b last:border-b-0">
            {/* Name */}
            <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                {item.soldByWeight && (
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.weight}
                        onChange={(e) => onWeightChange(item.id, Number(e.target.value))}
                        className="mt-1 w-24 px-2 py-1 border rounded text-sm"
                        placeholder="Weight kg"
                    />
                )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                >
                    -
                </button>
                <span>{item.quantity}</span>
                <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                >
                    +
                </button>
            </div>

            {/* Price */}
            <div className="font-semibold text-green-600 ml-4">
                ₱{item.price * item.quantity * (item.soldByWeight ? item.weight : 1)}
            </div>

            {/* Remove */}
            <button
                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                onClick={() => onRemove(item.id)}
            >
                ×
            </button>
        </div>
    );
}
