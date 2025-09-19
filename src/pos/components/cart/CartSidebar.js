import React, { useState, useMemo, useCallback } from "react";
import { useCart } from "../contexts/cartContext";
import { ShoppingCart } from "lucide-react";
import CartItemRow from "./CartItemRow";
import EditCartItemModal from "../modals/EditCartItemModal";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";
import OrderSummaryModal from "../payment/OrderSummaryModal";
import OrderSuccessModal from "../payment/OrderSuccessModal";
import OrderFailedModal from "../payment/OrderFailedModal";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import EmptyState from "../../../components/CommonComponents/EmptyState";
import { formatPrice } from "../../utils/FormatPrice";
import { createOrder } from "../../../services/orderApi";

export default function CartSidebar() {
    const { cart, removeFromCart, clearCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    // Modals
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
    const [isPaymentErrorOpen, setIsPaymentErrorOpen] = useState(false);

    const [pendingPayment, setPendingPayment] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);

    // Calculate totals
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
    const total = subtotal; // removed discount

    // Handlers wrapped in useCallback to prevent unnecessary re-renders
    const handlePlaceOrder = useCallback(({ paymentMethod, amountPaid }) => {
        setPendingPayment({ cart, subtotal, total, paymentMethod, amountPaid });
        setIsOrderSummaryOpen(true);
    }, [cart, subtotal, total]);

    const confirmOrder = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) throw new Error("User not logged in");

            const mappedCart = pendingPayment.cart.map(item => ({
                product_id: item.productId || item.id,
                qty: item.qty,
                price: item.price,
            }));

            const orderData = { user_id: user.id, cart: mappedCart, payment_method: pendingPayment.paymentMethod };
            const response = await createOrder(orderData);

            const fullOrder = {
                ...response,
                cart: pendingPayment.cart.map(item => ({
                    product_id: item.productId || item.id,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                })),
                subtotal: pendingPayment.subtotal,
                total: pendingPayment.total,
                payment_method: pendingPayment.paymentMethod,
            };

            setPaymentResult(fullOrder);
            clearCart();
            setIsOrderSummaryOpen(false);
            setIsOrderSuccessOpen(true);
        } catch (error) {
            console.error("Order API error:", error);
            setIsOrderSummaryOpen(false);
            setIsPaymentErrorOpen(true);
        }
    }, [pendingPayment, clearCart]);

    return (
        <>
            <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0">
                    <h2 className="text-lg font-semibold text-neutralDark">
                        {cart.length === 0 ? "No pending order" : paymentResult ? `Order #${paymentResult.order_number}` : "Pending Order"}
                    </h2>
                    <p className="text-xs text-neutralGray mt-0.5 uppercase tracking-wide">Ordered Items</p>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {cart.length === 0 ? (
                        <EmptyState icon={ShoppingCart} message="Cart is empty" />
                    ) : (
                        cart.map(item => (
                            <CartItemRow
                                key={item.lineId || item.id}
                                item={item}
                                formatPrice={formatPrice}
                                onEdit={() => setEditItem(item)}
                                onDelete={() => setDeleteItem(item)}
                            />
                        ))
                    )}
                </div>

                {/* Total */}
                <div className="flex-shrink-0 border-t border-neutralBorder bg-neutralCard px-4 py-3 rounded-b-xl">
                    <PaymentSummary subtotal={subtotal} total={total} />
                </div>

                {/* Edit/Delete Modals */}
                {editItem && <EditCartItemModal item={editItem} onClose={() => setEditItem(null)} autoFocus={false} />}
                {deleteItem && (
                    <ConfirmationModal
                        isOpen={!!deleteItem}
                        onClose={() => setDeleteItem(null)}
                        onConfirm={() => { removeFromCart(deleteItem.lineId || deleteItem.id); setDeleteItem(null); }}
                        title="Remove Item"
                        message={`Are you sure you want to remove "${deleteItem.name}" from the cart?`}
                        confirmText="Yes, Remove"
                        cancelText="Cancel"
                        type="delete"
                    />
                )}

                {/* Order Summary */}
                {isOrderSummaryOpen && pendingPayment && (
                    <OrderSummaryModal
                        isOpen={isOrderSummaryOpen}
                        onClose={() => setIsOrderSummaryOpen(false)}
                        order={{ ...pendingPayment }}
                        onConfirm={confirmOrder}
                    />
                )}

                {/* Success / Error Modals */}
                {isOrderSuccessOpen && paymentResult && (
                    <OrderSuccessModal
                        isOpen={isOrderSuccessOpen}
                        onClose={() => setIsOrderSuccessOpen(false)}
                        orderNumber={paymentResult.order_number}
                    />
                )}
                {isPaymentErrorOpen && (
                    <OrderFailedModal
                        isOpen={isPaymentErrorOpen}
                        onClose={() => setIsPaymentErrorOpen(false)}
                        message="Failed to create order. Please try again."
                    />
                )}
            </aside>

            {/* Payment Panel */}
            <div className="mt-4">
                <PaymentPanel total={total} cart={cart} onPay={handlePlaceOrder} />
            </div>
        </>
    );
}
