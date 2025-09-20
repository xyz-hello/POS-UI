// src/components/POS/cart/CartSidebar.js
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
    const { cart, addToCart, removeFromCart, clearCart } = useCart();

    // Edit / Delete modals
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    // Order modals
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
    const [isPaymentErrorOpen, setIsPaymentErrorOpen] = useState(false);

    // Pending payment for OrderSummaryModal
    const [pendingPayment, setPendingPayment] = useState(null);

    // Last confirmed order (for displaying order number)
    const [lastConfirmedOrder, setLastConfirmedOrder] = useState(null);

    // Row highlight key (last added/updated item)
    const [lastAddedItem, setLastAddedItem] = useState(null);

    // Cart badge bump animation
    const [cartCountHighlight, setCartCountHighlight] = useState(false);

    // Totals
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
    const total = subtotal; // no discount here

    // Animate cart badge
    const bumpCartCount = useCallback(() => {
        setCartCountHighlight(true);
        setTimeout(() => setCartCountHighlight(false), 300);
    }, []);

    // Add product to cart (immediate update + animations)
    const handleAddToCart = useCallback((product, qty = 1) => {
        addToCart(product, qty);      // update cartContext
        setLastAddedItem(product.id); // trigger row highlight
        bumpCartCount();              // animate badge
    }, [addToCart, bumpCartCount]);

    // Open OrderSummaryModal
    const handlePlaceOrder = useCallback(({ paymentMethod, amountPaid }) => {
        setPendingPayment({ cart, subtotal, total, paymentMethod, cashReceived: amountPaid });
        setIsOrderSummaryOpen(true);
    }, [cart, subtotal, total]);

    // Confirm order API
    const confirmOrder = useCallback(async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) throw new Error("User not logged in");

            const mappedCart = pendingPayment.cart.map(item => ({
                product_id: item.productId || item.id,
                qty: item.qty,
                price: item.price,
            }));

            const orderData = {
                user_id: user.id,
                cart: mappedCart,
                payment_method: pendingPayment.paymentMethod
            };

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
                cashReceived: pendingPayment.cashReceived
            };

            setLastConfirmedOrder(fullOrder); // display order number
            clearCart();
            setIsOrderSummaryOpen(false);
            setIsOrderSuccessOpen(true);
            setPendingPayment(null);
            setLastAddedItem(null); // reset row highlight

        } catch (error) {
            console.error("Order API error:", error);
            setIsOrderSummaryOpen(false);
            setIsPaymentErrorOpen(true);
        }
    }, [pendingPayment, clearCart]);

    return (
        <>
            {/* Sidebar */}
            <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-neutralDark">
                            {cart.length > 0
                                ? "Pending Order"
                                : lastConfirmedOrder
                                    ? `Order #${lastConfirmedOrder.order_number}`
                                    : "No Pending Order"}
                        </h2>
                        <p className="text-xs text-neutralGray mt-0.5 uppercase tracking-wide">
                            Ordered Items
                        </p>
                    </div>
                    {/* Cart icon with badge */}
                    <div className="relative">
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className={`absolute -top-2 -right-2 bg-brandGreen text-white text-xs font-bold rounded-full px-2 py-0.5 transition-transform
                                ${cartCountHighlight ? "scale-125" : "scale-100"}`}>
                                {cart.reduce((sum, i) => sum + i.qty, 0)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <CartItemRow
                                key={item.lineId || item.id}
                                item={item}
                                formatPrice={formatPrice}
                                onEdit={() => setEditItem(item)}
                                onDelete={() => setDeleteItem(item)}
                                highlightKey={lastAddedItem} // animate new/updated row
                            />
                        ))
                    ) : (
                        <EmptyState icon={ShoppingCart} message="Cart is empty" />
                    )}
                </div>

                {/* Totals */}
                <div className="flex-shrink-0 border-t border-neutralBorder bg-neutralCard px-4 py-3 rounded-b-xl">
                    <PaymentSummary subtotal={subtotal} total={total} />
                </div>

                {/* Edit / Delete Modals */}
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
                {isOrderSuccessOpen && lastConfirmedOrder && (
                    <OrderSuccessModal
                        isOpen={isOrderSuccessOpen}
                        onClose={() => setIsOrderSuccessOpen(false)}
                        orderNumber={lastConfirmedOrder.order_number}
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
