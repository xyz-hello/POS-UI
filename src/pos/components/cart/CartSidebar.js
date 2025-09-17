// filepath: src/components/POS/CartSidebar.js
import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";
import { formatPrice } from "../../utils/FormatPrice";

export default function CartSidebar() {
    const { cart, removeFromCart, clearCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [orderNumber, setOrderNumber] = useState(null); // dynamic order number

    // Calculate subtotal and total
    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart]
    );
    const discount = 0;
    const total = subtotal - discount;

    /** Called when payment completes successfully */
    const handleOrderComplete = (order_number, paidAmount) => {
        setOrderNumber(order_number); // update order number
        clearCart(); // clear cart after successful payment
    };

    return (
        <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0">
                <h2 className="text-lg font-semibold text-neutralDark">
                    {cart.length === 0
                        ? "No pending order"
                        : orderNumber
                            ? `Order #${orderNumber}`
                            : "Pending Order"}
                </h2>
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
                            key={item.lineId || item.id}
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
                <PaymentSummary subtotal={subtotal} discount={discount} total={total} />
                <div className="mt-2">
                    <PaymentPanel
                        total={total}
                        cart={cart}
                        onOrderComplete={handleOrderComplete}
                    />
                </div>
            </div>

            {/* Modals */}
            {editItem && (
                <EditCartItemModal item={editItem} onClose={() => setEditItem(null)} />
            )}
            {deleteItem && (
                <ConfirmationModal
                    isOpen={!!deleteItem}
                    onClose={() => setDeleteItem(null)}
                    onConfirm={() => {
                        removeFromCart(deleteItem.lineId || deleteItem.id);
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
