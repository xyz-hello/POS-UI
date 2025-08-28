import React from "react";
import CartItem from "./CartItem";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function OrderLinePreview({ orderNumber, items, onQuantityChange, onWeightChange, onRemove }) {
    // Calculate subtotal
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity * (item.soldByWeight ? item.weight : 1),
        0
    );

    const total = subtotal; // Total is just subtotal

    return (
        <div className="flex-1 overflow-y-auto scroll-modern p-2 bg-white rounded-xl border border-gray-200 shadow-sm">

            {/* Header: Only Order Number */}
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-gray-800">Order #{orderNumber}</div>
                <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-100 transition">
                        <PencilIcon className="w-5 h-5 text-gray-800" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100 transition">
                        <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Ordered Items */}
            <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-2">Ordered Items</div>
                <div className="flex flex-col divide-y divide-gray-200">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onQuantityChange={onQuantityChange}
                            onWeightChange={onWeightChange}
                            onRemove={onRemove}
                            minimal
                        />
                    ))}
                </div>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col gap-1 mb-3 text-gray-800 text-sm">
                <div className="flex justify-between font-semibold text-base">
                    <span>Total Payable</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
