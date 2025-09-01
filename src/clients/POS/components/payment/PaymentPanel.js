import React, { useState } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(total);

    const quickCashButtons = [20, 50, 100, 200, 500];

    const handleQuickCash = (value) => setAmountPaid((prev) => prev + value);

    const handlePay = () => {
        if (amountPaid >= total) {
            onPay({ method: paymentMethod, amount: amountPaid });
            setAmountPaid(total); // Reset to total for next transaction
        } else {
            alert("Insufficient amount");
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
            {/* Payment method selection */}
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {/* Quick cash buttons (cash only) */}
            {paymentMethod === "cash" && (
                <div className="flex flex-wrap gap-2">
                    {quickCashButtons.map((value) => (
                        <button
                            key={value}
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
                placeholder="Enter amount"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {/* Pay button */}
            <button
                onClick={handlePay}
                className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
                Pay {formatPrice(amountPaid)}
            </button>
        </div>
    );
}
