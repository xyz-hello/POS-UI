// filepath: src/components/POS/payment/PaymentPanel.js
import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";

/**
 * PaymentPanel
 * - Handles payment method selection
 * - Provides Quick Cash options for faster input
 * - Calculates change and validates payment
 * - Calls onPay when Place Order is clicked
 */
export default function PaymentPanel({ total, cart, onPay }) {
    const [paymentMethod, setPaymentMethod] = useState("cash"); // current selected payment method
    const [amountPaid, setAmountPaid] = useState(""); // user-entered or quick cash amount
    const [error, setError] = useState(""); // error message

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500]; // predefined quick cash options

    // Reset amountPaid & errors whenever order total changes
    useEffect(() => {
        setAmountPaid("");
        setError("");
    }, [total]);

    const numericPaid = Number(amountPaid) || 0;
    const change = Math.max(numericPaid - total, 0);

    /** Handle quick cash button clicks */
    const handleQuickCash = (value) => {
        setAmountPaid(value.toString());
        setError("");
    };

    /** Handle manual input in amount field */
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (Number(value) < 0) return;
        setAmountPaid(value);
        setError("");
    };

    /** Validate payment and trigger onPay callback */
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
            {/* Select payment method */}
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {/* Cash payment options */}
            {paymentMethod === "cash" && (
                <div className="p-3 rounded-lg border border-neutralBorder bg-white shadow-sm">
                    {/* Quick Cash Buttons */}
                    <div className="flex flex-wrap gap-2 mb-2">
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

                    {/* Input & Change */}
                    <input
                        type="number"
                        min="0"
                        value={amountPaid}
                        onChange={handleInputChange}
                        placeholder="Enter amount received"
                        className="w-full py-2 px-3 rounded-md border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen text-sm"
                    />
                    <p className="text-sm text-neutralGray mt-1">
                        Change: {formatPrice(change)}
                    </p>
                </div>
            )}

            {/* Show validation errors */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Place Order button */}
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
                    {`Place Order`}
                </button>
            </div>
        </div>
    );
}
