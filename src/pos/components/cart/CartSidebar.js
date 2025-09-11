import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";
import { formatPrice } from "../../utils/FormatPrice";

export default function CartSidebar() {
    const { cart, removeFromCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    // Calculate subtotal and total
    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart]
    );
    const discount = 0;
    const total = subtotal - discount;

    // Handle payment
    const handlePayTransaction = ({ method, amount }) => {
        console.log("Payment Info:", { method, amount });
        alert(`Paid ${formatPrice(amount)} via ${method}`);
    };

    return (
        <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0">
                <h2 className="text-lg font-semibold text-neutralDark">Order #12345</h2>
                <p className="text-xs text-neutralGray mt-0.5 uppercase tracking-wide">
                    Ordered Items
                </p>
            </div>

            {/* Cart items scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                {cart.length === 0 ? (
                    <p className="text-center text-neutralGray text-sm mt-2 flex items-center justify-center gap-1">
                        <ShoppingCart size={16} />
                        Cart is empty
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center py-1.5 border-b border-neutralBorder last:border-none"
                        >
                            {/* Product info */}
                            <p className="text-sm text-neutralDark truncate">
                                {item.qty}× {item.name}
                            </p>

                            {/* Price + actions */}
                            <div className="flex items-center space-x-1">
                                <p className="text-sm font-semibold text-neutralDark">
                                    {formatPrice(item.price * item.qty)}
                                </p>
                                <button
                                    onClick={() => setEditItem(item)}
                                    className="text-neutralGray hover:text-brandGreenDark transition"
                                    title="Edit item"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteItem(item)}
                                    className="text-neutralGray hover:text-red-600 transition"
                                    title="Remove item"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer - sticky at bottom */}
            <div className="flex-shrink-0 border-t border-neutralBorder bg-neutralCard px-4 py-3 rounded-b-xl">
                <PaymentSummary subtotal={subtotal} discount={discount} />
                <div className="mt-2">
                    <PaymentPanel total={total} onPay={handlePayTransaction} />
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
                    isOpen={!!deleteItem}
                    onClose={() => setDeleteItem(null)}
                    onConfirm={() => {
                        removeFromCart(deleteItem.id);
                        setDeleteItem(null);
                    }}
                    title="Remove Item"
                    message={`Are you sure you want to remove "${deleteItem.name}" from the cart?`}
                    confirmText="Yes, Remove"
                    cancelText="Cancel"
                    type="delete"
                />
            )}
        </aside>
    );
}
