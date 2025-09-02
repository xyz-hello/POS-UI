import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(""); // start empty
    const [error, setError] = useState(""); // inline error message

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    // Reset panel for a new transaction
    useEffect(() => {
        setAmountPaid("");
        setError("");
    }, [total]);

    // Convert input to number safely
    const numericPaid = Number(amountPaid) || 0;
    const change = Math.max(numericPaid - total, 0);

    // Quick Cash button (overwrite for exact cash)
    const handleQuickCash = (value) => {
        setAmountPaid(value.toString()); // set exact amount
        setError(""); // clear error
    };

    // Handle manual input
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (Number(value) < 0) return; // prevent negative
        setAmountPaid(value);
        setError(""); // clear error
    };

    // Handle Pay
    const handlePay = () => {
        if (numericPaid < total) {
            setError("Insufficient amount");
            return;
        }
        onPay({ method: paymentMethod, amount: numericPaid });
        setAmountPaid("");
        setError("");
    };

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Payment method selection */}
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {/* Quick cash buttons (only for cash) */}
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
            {paymentMethod === "cash" && (
                <input
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={handleInputChange}
                    placeholder="Enter amount received"
                    className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
            )}

            {/* Inline error message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Show change dynamically */}
            {paymentMethod === "cash" && (
                <p className="text-sm text-gray-600">Change: {formatPrice(change)}</p>
            )}

            {/* Pay button pinned at bottom */}
            <div className="mt-auto">
                <button
                    type="button"
                    onClick={handlePay}
                    disabled={paymentMethod === "cash" && numericPaid < total}
                    className="w-full py-2 bg-brandGreen text-white rounded-md font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    Pay {formatPrice(numericPaid)}
                </button>
            </div>
        </div>
    );
}
