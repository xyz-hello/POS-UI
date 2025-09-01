import React, { useState } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

// PAYMENT PANEL COMPONENT
export default function PaymentPanel({ total, onPay }) {
    // Track selected payment method
    const [paymentMethod, setPaymentMethod] = useState("cash");
    // Track entered/paid amount
    const [amountPaid, setAmountPaid] = useState(total);

    // Common quick-cash button values
    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    // Add quick cash value to current amount
    const handleQuickCash = (value) => {
        setAmountPaid((prev) => prev + value);
    };

    // Handle payment submission
    const handlePay = () => {
        if (amountPaid < total) {
            alert("Insufficient amount");
            return;
        }

        onPay({ method: paymentMethod, amount: amountPaid });

        // Reset amount back to total (assume fresh transaction)
        setAmountPaid(total);
    };

    return (
        <div className="bg-white p-4 rounded-t-xl shadow-md flex flex-col gap-4">
            {/* Payment method selection */}
            <PaymentMethod
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
            />

            {/* Quick cash shortcuts (only when using cash) */}
            {paymentMethod === "cash" && (
                <div className="flex flex-wrap gap-2">
                    {QUICK_CASH_VALUES.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleQuickCash(value)}
                            className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
                        >
                            {formatPrice(value)}
                        </button>
                    ))}
                </div>
            )}

            {/* Custom amount input */}
            <input
                type="number"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                placeholder="Enter amount"
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Pay button */}
            <button
                type="button"
                onClick={handlePay}
                className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={amountPaid < total}
            >
                Pay {formatPrice(amountPaid)}
            </button>
        </div>
    );
}
