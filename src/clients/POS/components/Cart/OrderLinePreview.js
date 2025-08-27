import React from "react";
import CartItem from "./CartItem";

export default function OrderLinePreview({ items, onQuantityChange, onWeightChange, onRemove }) {
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity * (item.soldByWeight ? item.weight : 1),
        0
    );

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-lg p-4">
            <h2 className="font-bold text-xl mb-3">Order Line</h2>

            <div className="flex-1 overflow-auto flex flex-col gap-2">
                {items.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No items added yet</div>
                ) : (
                    items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onQuantityChange={onQuantityChange}
                            onWeightChange={onWeightChange}
                            onRemove={onRemove}
                        />
                    ))
                )}
            </div>

            <div className="mt-4 flex justify-between items-center font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>₱{total}</span>
            </div>

            <button className="mt-4 w-full py-2 bg-brandGreen text-white rounded-lg hover:bg-green-600 transition">
                Checkout
            </button>
        </div>
    );
}
