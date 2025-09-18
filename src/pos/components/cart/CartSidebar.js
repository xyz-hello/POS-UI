// src/components/POS/CartSidebar.js
import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";
import OrderSummaryModal from "../payment/OrderSummaryModal";
import OrderSuccessModal from "../payment/OrderSuccessModal";
import OrderFailedModal from "../payment/OrderFailedModal";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import { formatPrice } from "../../utils/FormatPrice";
import { createOrder } from "../../../services/orderApi";

export default function CartSidebar() {
    const { cart, removeFromCart, clearCart } = useCart();
    const [editItem, setEditItem] = useState(null); // Currently editing item
    const [deleteItem, setDeleteItem] = useState(null); // Item to remove

    // Modals
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false); // Order summary confirmation
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false); // Success modal
    const [isPaymentErrorOpen, setIsPaymentErrorOpen] = useState(false); // Error modal

    const [pendingPayment, setPendingPayment] = useState(null); // Temp storage for order before confirmation
    const [paymentResult, setPaymentResult] = useState(null); // Store finalized order details

    // Calculate totals
    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        [cart]
    );
    const discount = 0;
    const total = subtotal - discount;

    // Triggered when "Place Order" is clicked in PaymentPanel
    const handlePlaceOrder = ({ paymentMethod, amountPaid }) => {
        setPendingPayment({
            cart,
            subtotal,
            discount,
            total,
            paymentMethod,
            amountPaid,
        });
        setIsOrderSummaryOpen(true); // Open summary modal first
    };

    // Confirm order: send to backend and handle success/failure
    const confirmOrder = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) throw new Error("User not logged in");

            const mappedCart = pendingPayment.cart.map((item) => ({
                product_id: item.productId || item.id,
                qty: item.qty,
                price: item.price,
            }));

            const orderData = {
                user_id: user.id,
                cart: mappedCart,
                payment_method: pendingPayment.paymentMethod,
                discount: pendingPayment.discount || 0,
            };

            const response = await createOrder(orderData);

            // Combine backend response with local cart data for full summary
            const fullOrder = {
                ...response,
                cart: pendingPayment.cart.map((item) => ({
                    product_id: item.productId || item.id,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                })),
                subtotal: pendingPayment.subtotal,
                discount: pendingPayment.discount,
                total: pendingPayment.total,
                payment_method: pendingPayment.paymentMethod,
            };

            setPaymentResult(fullOrder);
            clearCart();
            setIsOrderSummaryOpen(false);

            // Show success modal
            setIsOrderSuccessOpen(true);
        } catch (error) {
            console.error("Order API error:", error);

            // Close summary modal if open
            setIsOrderSummaryOpen(false);

            // Open failed modal
            setIsPaymentErrorOpen(true);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0">
                    <h2 className="text-lg font-semibold text-neutralDark">
                        {cart.length === 0
                            ? "No pending order"
                            : paymentResult
                                ? `Order #${paymentResult.order_number}`
                                : "Pending Order"}
                    </h2>
                    <p className="text-xs text-neutralGray mt-0.5 uppercase tracking-wide">
                        Ordered Items
                    </p>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {cart.length === 0 ? (
                        <p className="text-center text-neutralGray text-sm mt-2 flex items-center justify-center gap-1">
                            <ShoppingCart size={16} /> Cart is empty
                        </p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.lineId || item.id}
                                className="flex justify-between items-center py-1.5 border-b border-neutralBorder last:border-none"
                            >
                                <p className="text-sm text-neutralDark truncate">
                                    {item.qty}× {item.name}
                                </p>
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

                {/* Total */}
                <div className="flex-shrink-0 border-t border-neutralBorder bg-neutralCard px-4 py-3 rounded-b-xl">
                    <PaymentSummary
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                    />
                </div>

                {/* Edit/Delete modals */}
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

                {/* Order Summary Modal */}
                {isOrderSummaryOpen && pendingPayment && (
                    <OrderSummaryModal
                        isOpen={isOrderSummaryOpen}
                        onClose={() => setIsOrderSummaryOpen(false)}
                        order={{ ...pendingPayment }}
                        onConfirm={confirmOrder} // confirm button inside summary
                    />
                )}

                {/* Order Success Modal */}
                {isOrderSuccessOpen && paymentResult && (
                    <OrderSuccessModal
                        isOpen={isOrderSuccessOpen}
                        onClose={() => setIsOrderSuccessOpen(false)}
                        orderNumber={paymentResult.order_number} // show order number
                    />
                )}

                {/* Error modal */}
                {isPaymentErrorOpen && (
                    <OrderFailedModal
                        isOpen={isPaymentErrorOpen}
                        onClose={() => setIsPaymentErrorOpen(false)}
                        message="Failed to create order. Please try again."
                    />
                )}
            </aside>

            {/* Payment Panel outside of sidebar */}
            <div className="mt-4">
                <PaymentPanel total={total} cart={cart} onPay={handlePlaceOrder} />
            </div>
        </>
    );
}
