import React, { useState } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(Number(total) || 0);

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    const handleQuickCash = (value) => {
        setAmountPaid((prev) => prev + value);
    };

    const handlePay = () => {
        if (amountPaid < total) {
            alert("Insufficient amount");
            return;
        }
        onPay({ method: paymentMethod, amount: amountPaid });
        setAmountPaid(total); // reset for new transaction
    };

    return (
        <div className="bg-white p-4 rounded-t-xl shadow-md flex flex-col">
            {/* Content grows naturally */}
            <div className="flex flex-col gap-4">
                {/* Payment method pills */}
                <PaymentMethod
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                />

                {/* Quick cash buttons for cash */}
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
            </div>

            {/* Pay button pinned with margin-top */}
            <div className="mt-4">
                <button
                    type="button"
                    onClick={handlePay}
                    className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={amountPaid < total}
                >
                    Pay {formatPrice(amountPaid)}
                </button>
            </div>
        </div>
    );
}
