// filepath: src/components/POS/payment/PaymentPanel.js
import React, { useState, useEffect } from "react";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentMethod from "./PaymentMethod";
import { createOrder } from "../../../services/orderApi";
import { useCart } from "../contexts/cartContext";

export default function PaymentPanel({ total, cart, onOrderComplete }) {
    const { clearCart } = useCart(); // Context for clearing cart
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const QUICK_CASH_VALUES = [20, 50, 100, 200, 500];

    // Reset inputs when total changes
    useEffect(() => {
        setAmountPaid("");
        setError("");
    }, [total]);

    const numericPaid = Number(amountPaid) || 0;
    const change = Math.max(numericPaid - total, 0);

    // Quick cash button handler
    const handleQuickCash = (value) => {
        setAmountPaid(value.toString());
        setError("");
    };

    // Input field handler
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (Number(value) < 0) return;
        setAmountPaid(value);
        setError("");
    };

    // Main Pay button handler
    const handlePay = async () => {
        if (cart.length === 0) {
            setError("Cart is empty");
            return;
        }

        if (paymentMethod === "cash" && numericPaid < total) {
            setError("Insufficient amount");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Retrieve logged-in user
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            // Validate and map cart items
            const mappedCart = cart.map(item => {
                const product_id = item.productId || item.id;
                if (!product_id) throw new Error("Cart item missing product_id");
                return {
                    product_id,
                    qty: item.qty,
                    price: item.price,
                };
            });

            // Prepare order payload
            const orderData = {
                user_id: user.id,
                cart: mappedCart,
                payment_method: paymentMethod,
                discount: 0
            };

            // Call backend API
            const { order_number } = await createOrder(orderData);

            // Notify parent about order completion
            onOrderComplete(order_number, numericPaid);

            // Clear cart
            clearCart();

            // Reset local state
            setAmountPaid("");
            setError("");
        } catch (err) {
            console.error("PaymentPanel error:", err);
            setError(
                err.response?.data?.message || err.message || "Failed to process order. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Payment method selector */}
            <PaymentMethod selectedMethod={paymentMethod} onSelect={setPaymentMethod} />

            {/* Quick cash buttons */}
            {paymentMethod === "cash" && (
                <div className="flex flex-wrap gap-2">
                    {QUICK_CASH_VALUES.map(value => (
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

            {/* Custom cash input */}
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

            {/* Error message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Change display */}
            {paymentMethod === "cash" && (
                <p className="text-sm text-neutralGray">Change: {formatPrice(change)}</p>
            )}

            {/* Pay button */}
            <div className="mt-auto">
                <button
                    type="button"
                    onClick={handlePay}
                    disabled={loading || cart.length === 0 || (paymentMethod === "cash" && numericPaid < total)}
                    className={`w-full py-2 rounded-md text-white font-semibold text-sm transition
                        ${loading || cart.length === 0 || (paymentMethod === "cash" && numericPaid < total)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-brandGreen hover:bg-brandGreenDark"
                        }`}
                >
                    {loading ? "Processing..." : `Pay ${formatPrice(paymentMethod === "cash" ? numericPaid || total : total)}`}
                </button>
            </div>
        </div>
    );
}
