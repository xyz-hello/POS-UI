// filepath: src/components/POS/payment/PaymentPanel.js
import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

export default function PaymentPanel({ total, cart, onPay }) {
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

    const handlePayClick = () => {
        if (cart.length === 0) {
            setError("Cart is empty");
            return;
        }
        if (paymentMethod === "cash" && numericPaid < total) {
            setError("Insufficient amount");
            return;
        }
        onPay({ paymentMethod, amountPaid: numericPaid });
    };

    return (
        <div className="flex flex-col h-full gap-3">
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {paymentMethod === "cash" && (
                <>
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
                    <input
                        type="number"
                        min="0"
                        value={amountPaid}
                        onChange={handleInputChange}
                        placeholder="Enter amount received"
                        className="w-full py-2 px-3 rounded-md border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen text-sm"
                    />
                    <p className="text-sm text-neutralGray">Change: {formatPrice(change)}</p>
                </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="mt-auto">
                <button
                    type="button"
                    onClick={handlePayClick}
                    disabled={cart.length === 0 || (paymentMethod === "cash" && numericPaid < total)}
                    className={`w-full py-2 rounded-md text-white font-semibold text-sm transition
                        ${cart.length === 0 || (paymentMethod === "cash" && numericPaid < total)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-brandGreen hover:bg-brandGreenDark"
                        }`}
                >
                    {`Pay ${formatPrice(paymentMethod === "cash" ? numericPaid || total : total)}`}
                </button>
            </div>
        </div>
    );
}
