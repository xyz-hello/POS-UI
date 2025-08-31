import React, { useState } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2 } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { formatPrice } from "../../utils/FormatPrice";

export default function CartSidebar() {
    const { cart, removeFromCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    // TODO: Replace total calculation with backend value if needed
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <aside className="w-72 bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-full max-h-[calc(100vh-4rem)]">

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
                {/* TODO: Replace static order number with real API data */}
                <h2 className="text-lg font-semibold text-gray-800">Order #12345</h2>

                {/* Label for the cart items */}
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
                    Ordered Items
                </p>
            </div>

            {/* Scrollable list of cart items */}
            <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                    <p className="text-gray-400 text-sm mt-3 text-center">
                        {/* TODO: Can replace with "No items in cart" from API message */}
                        Cart is empty
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={`${item.id}-${item.weight || "unit"}`}
                            className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-none"
                        >
                            {/* Item quantity and name */}
                            <div className="flex-1 pr-2">
                                {/* TODO: Use item.name from API when available */}
                                <p className="text-sm text-gray-700 leading-tight">
                                    {item.qty}× {item.name}
                                </p>
                            </div>

                            {/* Price and action buttons */}
                            <div className="flex items-center space-x-1">
                                {/* TODO: Use price from API; formatPrice can stay */}
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatPrice(item.price * item.qty)}
                                </p>

                                {/* Edit item button */}
                                <button
                                    onClick={() => setEditItem(item)}
                                    className="text-gray-400 hover:text-blue-600"
                                >
                                    <Pencil size={14} />
                                </button>

                                {/* Remove item button */}
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

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between text-sm font-semibold text-gray-800">
                    <span>Total</span>
                    {/* TODO: Replace static total with API value if needed */}
                    <span>{formatPrice(total)}</span>
                </div>
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
                        // TODO: Call API to remove item in backend
                        removeFromCart(deleteItem.id, deleteItem.weight);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </aside>
    );
}
