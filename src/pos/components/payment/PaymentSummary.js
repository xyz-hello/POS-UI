import React from "react";
import { formatPrice } from "../../utils/FormatPrice";

/**
 * Displays subtotal, discount, and total.
 * Accepts optional tax or additional fees in future.
 */
export default function PaymentSummary({ subtotal = 0, discount = 0, total }) {
    // Compute total if not provided
    const finalTotal = total ?? subtotal - discount;

    return (
        <div className="flex flex-col gap-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            {/* Discount */}
            {discount > 0 && (
                <div className="flex justify-between text-sm text-gray-700">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                </div>
            )}

            {/* Dashed line separator */}
            <div className="px-2 my-1">
                <div className="border-b-2 border-dashed border-gray-300"></div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
            </div>
        </div>
    );
}
