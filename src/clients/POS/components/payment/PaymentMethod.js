import React from "react";

export default function PaymentMethod({ selectedMethod, onSelect }) {
    const methods = [
        { key: "cash", label: "Cash" },
        { key: "ewallet", label: "E-Wallet" },
        { key: "scan", label: "Scan" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border-gray-200 shadow-sm  p-4">
            {/* Section Label */}
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Payment Method
            </h3>

            {/* Pills row */}
            <div className="flex gap-2">
                {methods.map((method) => (
                    <button
                        key={method.key}
                        onClick={() => onSelect(method.key)}
                        className={`flex-1 py-1.5 rounded-lg font-medium border text-xs transition-colors
                            ${selectedMethod === method.key
                                ? "bg-white text-brandGreen border-brandGreen" // outline-only when selected
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }
                        `}
                    >
                        {method.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
