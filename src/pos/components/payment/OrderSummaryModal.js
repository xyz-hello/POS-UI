// src/components/POS/payment/OrderSummaryModal.js
import React from "react";
import { formatPrice } from "../../utils/FormatPrice";

export default function OrderSummaryModal({ isOpen, onClose, order, onConfirm }) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl w-96 max-h-[80vh] overflow-hidden shadow-lg flex flex-col">

                {/* Header */}
                <div className="px-4 py-3 border-b border-neutralBorder">
                    <h3 className="text-lg font-bold text-neutralDark">Order #{order.order_number || "Summary"}</h3>
                    <p className="text-sm text-neutralGray mt-1">Order Summary</p>
                </div>

                {/* Cart Items (Scrollable) */}
                <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
                    {order.cart.map((item) => (
                        <div key={item.product_id} className="flex justify-between py-1 border-b border-neutralBorder last:border-none">
                            <span className="truncate">{item.qty}× {item.name}</span>
                            <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="px-4 py-3 border-t border-neutralBorder space-y-1">
                    <div className="flex justify-between font-semibold">
                        <span>Subtotal:</span>
                        <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Discount:</span>
                        <span>{formatPrice(order.discount)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutralGray">
                        <span>Payment Method:</span>
                        <span>{order.payment_method}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 border-t border-neutralBorder flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-brandGreen hover:bg-brandGreenDark text-white font-semibold px-4 py-2 rounded-md"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
}
