import React, { useState } from "react";

export default function WeightInputModal({ item, onConfirm, onClose }) {
    const [weight, setWeight] = useState(""); // track user input for grams

    if (!item) return null; // don't render if no item is passed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            {/* Modal container */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                {/* Title */}
                <h2 className="text-lg font-semibold mb-4">
                    Enter weight for {item.name}
                </h2>

                {/* Input field */}
                <input
                    type="number"
                    placeholder="grams"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    {/* Cancel button */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    {/* Confirm button */}
                    <button
                        onClick={() => {
                            const totalPrice = weight * (item.pricePerGram || 0);
                            onConfirm({ ...item, weight, price: totalPrice });
                            onClose();
                        }}
                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
