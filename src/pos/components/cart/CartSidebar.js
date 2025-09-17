// filepath: src/components/POS/CartSidebar.js
import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/cartContext";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import EditCartItemModal from "../modals/EditCartItemModal";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import PaymentPanel from "../payment/PaymentPanel";
import PaymentSummary from "../payment/PaymentSummary";
import { formatPrice } from "../../utils/FormatPrice";
import { createOrder } from "../../../services/orderApi";

export default function CartSidebar() {
    const { cart, removeFromCart, clearCart } = useCart();
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    // Modals
    const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false);
    const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
    const [isPaymentErrorOpen, setIsPaymentErrorOpen] = useState(false);

    const [pendingPayment, setPendingPayment] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
    const discount = 0;
    const total = subtotal - discount;

    // Trigger order confirmation modal
    const handlePayClick = ({ paymentMethod, amountPaid }) => {
        setPendingPayment({ cart, subtotal, discount, total, paymentMethod, amountPaid });
        setIsOrderConfirmOpen(true);
    };

    // Confirm payment and call backend
    const confirmPayment = async () => {
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
            setPaymentResult(response);
            setIsOrderConfirmOpen(false);
            setIsPaymentSuccessOpen(true);
            clearCart();
        } catch (error) {
            console.error("Order API error:", error);
            setIsPaymentErrorOpen(true);
        }
    };

    return (
        <aside className="w-72 bg-neutralCard rounded-xl shadow-md flex flex-col h-full mt-4 overflow-hidden">
            <div className="px-4 py-2 border-b border-neutralBorder flex-shrink-0">
                <h2 className="text-lg font-semibold text-neutralDark">
                    {cart.length === 0 ? "No pending order" : paymentResult ? `Order #${paymentResult.order_number}` : "Pending Order"}
                </h2>
                <p className="text-xs text-neutralGray mt-0.5 uppercase tracking-wide">Ordered Items</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                {cart.length === 0 ? (
                    <p className="text-center text-neutralGray text-sm mt-2 flex items-center justify-center gap-1">
                        <ShoppingCart size={16} /> Cart is empty
                    </p>
                ) : (
                    cart.map((item) => (
                        <div key={item.lineId || item.id} className="flex justify-between items-center py-1.5 border-b border-neutralBorder last:border-none">
                            <p className="text-sm text-neutralDark truncate">{item.qty}× {item.name}</p>
                            <div className="flex items-center space-x-1">
                                <p className="text-sm font-semibold text-neutralDark">{formatPrice(item.price * item.qty)}</p>
                                <button onClick={() => setEditItem(item)} className="text-neutralGray hover:text-brandGreenDark transition" title="Edit item"><Pencil size={14} /></button>
                                <button onClick={() => setDeleteItem(item)} className="text-neutralGray hover:text-red-600 transition" title="Remove item"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex-shrink-0 border-t border-neutralBorder bg-neutralCard px-4 py-3 rounded-b-xl">
                <PaymentSummary subtotal={subtotal} discount={discount} total={total} />
                <div className="mt-2">
                    <PaymentPanel total={total} cart={cart} onPay={handlePayClick} />
                </div>
            </div>

            {/* Edit/Delete modals */}
            {editItem && <EditCartItemModal item={editItem} onClose={() => setEditItem(null)} />}
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

            {/* Order confirmation modal */}
            {isOrderConfirmOpen && (
                <ConfirmationModal
                    isOpen={isOrderConfirmOpen}
                    onClose={() => setIsOrderConfirmOpen(false)}
                    onConfirm={confirmPayment}
                    title="Confirm Your Order"
                    confirmText="Confirm Payment"
                    cancelText="Cancel"
                    type="payment"
                >
                    <div className="space-y-2">
                        {pendingPayment?.cart.map((item) => (
                            <div key={item.lineId || item.id} className="flex justify-between">
                                <span>{item.qty}× {item.name}</span>
                                <span>{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                        <div className="border-t border-neutralBorder mt-2 pt-2 font-bold flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatPrice(pendingPayment?.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>{formatPrice(pendingPayment?.discount || 0)}</span>
                        </div>
                        <div className="flex justify-between text-lg">
                            <span>Total:</span>
                            <span>{formatPrice(pendingPayment?.total || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span>{pendingPayment?.paymentMethod}</span>
                        </div>
                    </div>
                </ConfirmationModal>
            )}

            {/* Success modal */}
            {isPaymentSuccessOpen && (
                <ConfirmationModal
                    isOpen={isPaymentSuccessOpen}
                    onClose={() => setIsPaymentSuccessOpen(false)}
                    title="Payment Successful"
                    message={`Order #${paymentResult?.order_number} has been created successfully!`}
                    confirmText="Close"
                    type="success"
                />
            )}

            {/* Error modal */}
            {isPaymentErrorOpen && (
                <ConfirmationModal
                    isOpen={isPaymentErrorOpen}
                    onClose={() => setIsPaymentErrorOpen(false)}
                    title="Payment Failed"
                    message="Failed to process order. Please try again."
                    confirmText="Close"
                    type="error"
                />
            )}
        </aside>
    );
}
