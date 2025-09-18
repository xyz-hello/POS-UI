// src/components/POS/payment/PaymentMethod.js
import React from "react";

export default function PaymentMethod({ selectedMethod, onSelect }) {
    // Define available payment methods
    const methods = [
        { key: "cash", label: "Cash" },
        { key: "ewallet", label: "E-Wallet" },
        { key: "scan", label: "Scan" },
    ];

    return (
        // Outer wrapper to give spacing and separation from other UI
        <div className="mt-4 mb-4">
            {/* Card wrapper with border, padding, rounded corners, and shadow */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-5">
                {/* Section Label */}
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                    Payment Method
                </h3>

                {/* Pills row */}
                <div className="flex gap-2">
                    {methods.map((method) => (
                        <button
                            key={method.key}
                            onClick={() => onSelect(method.key)} // Trigger selection
                            className={`flex-1 py-2 rounded-lg font-medium border text-xs transition-colors
                                ${selectedMethod === method.key
                                    ? "bg-white text-brandGreen border-brandGreen shadow-sm" // Highlight when selected
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }
                            `}
                        >
                            {method.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
