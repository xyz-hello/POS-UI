import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");
    const [error, setError] = useState("");

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    useEffect(() => {
        setAmountPaid("");
        setError("");
    }, [total]);

    const numericPaid = Number(amountPaid) || 0;
    const change = Math.max(numericPaid - total, 0);

    const handleQuickCash = (value) => {
        setAmountPaid(value.toString());
        setError("");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (Number(value) < 0) return;
        setAmountPaid(value);
        setError("");
    };

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
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

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

            {paymentMethod === "cash" && (
                <input
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={handleInputChange}
                    placeholder="Enter amount received"
                    className="w-full py-2 px-3 rounded-md border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen text-sm"
                />
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {paymentMethod === "cash" && (
                <p className="text-sm text-neutralGray">Change: {formatPrice(change)}</p>
            )}

            {/* Pay button */}
            <div className="mt-auto">
                <button
                    type="button"
                    onClick={handlePay}
                    disabled={paymentMethod === "cash" && numericPaid < total}
                    className="w-full py-2 bg-brandGreen text-white rounded-md font-semibold hover:bg-brandGreenDark disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
                >
                    Pay {formatPrice(numericPaid)}
                </button>
            </div>
        </div>
    );
}
