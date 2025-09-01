import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2 } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { formatPrice } from "../../utils/FormatPrice";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";

export default function CartSidebar() {
    const { cart, removeFromCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart]
    );
    const discount = 0;
    const total = subtotal - discount;

    const handlePayTransaction = ({ method, amount }) => {
        console.log("Payment Info:", { method, amount });
        alert(`Paid ${formatPrice(amount)} via ${method}`);
    };

    return (
        <aside
            className="w-72 bg-white rounded-xl shadow-md flex flex-col
                       max-h-[calc(100vh-1rem)] mt-2"
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Order #12345</h2>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
                    Ordered Items
                </p>
            </div>

            {/* Cart Items (scrollable) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
                {cart.length === 0 ? (
                    <p className="text-gray-400 text-sm mt-3 text-center">
                        Cart is empty
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={`${item.id}-${item.weight || "unit"}`}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none"
                        >
                            <div className="flex-1 pr-2">
                                <p className="text-sm text-gray-700 leading-tight">
                                    {item.qty}× {item.name}
                                </p>
                            </div>

                            <div className="flex items-center space-x-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatPrice(item.price * item.qty)}
                                </p>
                                <button
                                    onClick={() => setEditItem(item)}
                                    className="text-gray-400 hover:text-blue-600"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteItem(item)}
                                    className="text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                <div className="px-4 py-2">
                    <PaymentSummary subtotal={subtotal} discount={discount} />
                </div>

                <PaymentPanel
                    total={total}
                    onPay={handlePayTransaction}
                    // Pass className for pills/buttons
                    quickCashClassName={`flex-1 py-2 px-4 rounded-full font-semibold text-sm
        bg-white text-brandGreen border-2 border-brandGreen
        hover:bg-green-50 focus:ring-2 focus:ring-brandGreen
        transition-colors`}
                />

            </div>

            {/* Modals */}
            {editItem && (
                <EditCartItemModal
                    item={editItem}
                    onClose={() => setEditItem(null)}
                />
            )}
            {deleteItem && (
                <ConfirmationModal
                    title="Remove Item"
                    message={`Are you sure you want to remove ${deleteItem.name}?`}
                    onConfirm={() => {
                        removeFromCart(deleteItem.id, deleteItem.weight);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </aside>
    );
}
