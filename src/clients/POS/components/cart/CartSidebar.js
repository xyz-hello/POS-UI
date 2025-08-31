import React from "react";
import { useCart } from "../contexts/cartContext"; // hook to access cart state
import { formatPrice } from "../../utils/FormatPrice"; // shared utility for price formatting


export default function CartSidebar() {
    const { cart, removeFromCart } = useCart();

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <aside className="w-80 border-l bg-white flex flex-col shadow-lg">
            {/* Cart Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Cart</h2>
                <button className="text-xs text-gray-500 hover:text-red-500">
                    Clear
                </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {cart.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-6">
                        Cart is empty
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={`${item.id}-${item.weight || "unit"}`}
                            className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                        >
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    {item.qty} × {formatPrice(item.price)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold">
                                    {formatPrice(item.price * item.qty)}
                                </p>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t space-y-3">
                <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <button
                    disabled={cart.length === 0}
                    className="w-full bg-brandGreen text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50"
                >
                    Checkout
                </button>
            </div>
        </aside>
    );
}
