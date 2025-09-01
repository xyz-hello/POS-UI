import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(Number(total) || 0);

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    // Sync amountPaid if total changes
    useEffect(() => {
        setAmountPaid(total);
    }, [total]);

    const handleQuickCash = (value) => setAmountPaid((prev) => prev + value);

    const handlePay = () => {
        if (amountPaid < total) {
            alert("Insufficient amount");
            return;
        }
        onPay({ method: paymentMethod, amount: amountPaid });
        setAmountPaid(total); // reset for next transaction
    };

    return (
        // Use flex-col + full height to allow Pay button pinned at bottom
        <div className="flex flex-col h-full gap-3">
            {/* Payment method selection */}
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {/* Quick cash buttons */}
            {paymentMethod === "cash" && (
                <div className="flex flex-wrap gap-2">
                    {QUICK_CASH_VALUES.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleQuickCash(value)}
                            className="flex-1 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
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
                className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />

            {/* Pay button pinned at bottom */}
            <div className="mt-auto">
                <button
                    type="button"
                    onClick={handlePay}
                    disabled={amountPaid < total}
                    className="w-full py-2 bg-brandGreen text-white rounded-md font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    Pay {formatPrice(amountPaid)}
                </button>
            </div>
        </div>
    );
}
