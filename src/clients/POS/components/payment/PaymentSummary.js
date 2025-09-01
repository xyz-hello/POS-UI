import React from "react";
import { formatPrice } from "../../utils/FormatPrice";

export default function PaymentSummary({ subtotal, tax, discount }) {
    return (
        <div className="flex flex-col gap-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-sm text-gray-700">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between text-sm text-gray-700">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
            </div>

            {/* Dashed line separator */}
            <div className="px-2 my-1">
                <div className="border-b-2 border-dashed border-gray-300"></div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(subtotal + tax - discount)}</span>
            </div>
        </div>
    );
}
