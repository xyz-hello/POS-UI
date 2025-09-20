// src/components/POS/payment/PaymentMethod.js
import React from "react";
import { PAYMENT_METHODS } from "../../../constant/paymentMethod";

export default function PaymentMethod({ selectedMethod, onSelect }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-5">
            {/* Section Label */}
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Payment Method
            </h3>

            {/* Pills row */}
            <div className="flex gap-2">
                {PAYMENT_METHODS.map((method) => (
                    <button
                        key={method.key}
                        onClick={() => onSelect(method.key)}
                        className={`flex-1 py-2 rounded-lg font-medium border text-xs transition-colors
                            ${selectedMethod === method.key
                                ? "bg-white text-brandGreen border-brandGreen shadow-sm"
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
