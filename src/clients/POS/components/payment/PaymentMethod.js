import React from "react";

export default function PaymentMethod({ selectedMethod, onSelect }) {
    const methods = [
        { key: "cash", label: "Cash" },
        { key: "ewallet", label: "E-Wallet" },
    ];

    return (
        <div className="flex gap-2">
            {methods.map((method) => (
                <button
                    key={method.key}
                    onClick={() => onSelect(method.key)}
                    className={`flex-1 py-2 rounded-lg font-semibold border text-sm transition-colors
            ${selectedMethod === method.key
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
          `}
                >
                    {method.label}
                </button>
            ))}
        </div>
    );
}
