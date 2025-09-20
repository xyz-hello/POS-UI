// src/components/POS/payment/OrderSummaryModal.js
import React from "react";
import { formatPrice } from "../../utils/FormatPrice";
import { PAYMENT_LABELS } from "../../../constant/paymentMethod";

export default function OrderSummaryModal({ isOpen, onClose, order, onConfirm }) {
    if (!isOpen || !order) return null;

    const displayOrderNumber = order.order_number || `TMP-${order.id || Date.now()}`;
    const isSavedOrder = !!order.order_number;

    const paymentLabel = order.paymentMethod
        ? PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod
        : "Not selected";

    const change = (order?.paymentMethod === "cash" && order?.cashReceived)
        ? order.cashReceived - order.total
        : 0;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-xl flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
            >
                {/* Left Column: Cart Items */}
                <div className="w-full md:w-2/3 md:min-w-[50%] bg-gray-50 p-6 overflow-y-auto relative">
                    <h3 className="text-xl font-bold text-neutralDark mb-4">
                        {isSavedOrder ? `Order #${displayOrderNumber}` : "Order Summary"}
                    </h3>

                    <div className="space-y-2">
                        {order.cart?.length > 0 ? (
                            order.cart.map(item => (
                                <div
                                    key={item.product_id ?? item.id}
                                    className="flex items-center py-1 border-b border-dashed border-gray-300 last:border-none"
                                >
                                    <span className="flex-1 flex items-center">
                                        {/* Item name */}
                                        <span>{`${item.qty} × ${item.name}`}</span>

                                        {/* Dotted leader */}
                                        <span className="flex-1 border-dashed border-gray-300 mx-2"></span>

                                        {/* Price */}
                                        <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No items in this order.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Totals & Payment */}
                <div className="w-full md:w-1/3 bg-white p-6 border-t md:border-t-0 md:border-l border-neutralBorder flex flex-col justify-between">
                    <div className="space-y-2">
                        {/* Subtotal */}
                        <div className="flex justify-between text-base font-semibold border-b border-dashed border-gray-300 pb-1">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>

                        {/* Discount */}
                        <div className="flex justify-between text-base font-semibold border-b border-dashed border-gray-300 pb-1">
                            <span>Discount:</span>
                            <span>{formatPrice(order.discount)}</span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-lg font-bold text-brandGreen pt-2">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>

                        {/* Cash-specific fields */}
                        {order.paymentMethod === "cash" && order.cashReceived && (
                            <>
                                <div className="flex justify-between text-base font-semibold border-b border-dashed border-gray-300 pb-1">
                                    <span>Cash Received:</span>
                                    <span>{formatPrice(order.cashReceived)}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold pb-1">
                                    <span>Change:</span>
                                    <span>{formatPrice(change)}</span>
                                </div>
                            </>
                        )}

                        {/* Payment Method */}
                        <div className="flex justify-between text-sm text-neutralGray mt-2">
                            <span>Payment Method:</span>
                            <span>{paymentLabel}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-brandGreen hover:bg-brandGreenDark text-white font-semibold px-6 py-3 rounded-lg"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
