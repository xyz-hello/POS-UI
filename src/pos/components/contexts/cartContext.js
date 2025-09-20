
// filepath: src/contexts/cartContext.js
import React, { createContext, useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    /**
     * Add product to cart or update quantity
     * - Prevents exceeding available stock
     */
    const addToCart = (product, qty = 1) => {
        setCart((prev) => {
            const updatedCart = [...prev];
            const existingIndex = updatedCart.findIndex(
                (item) => item.productId === product.id
            );

            if (existingIndex !== -1) {
                const existingItem = updatedCart[existingIndex];
                const newQty = existingItem.qty + qty;

                if (product.stock && newQty > product.stock) {
                    toast.error(`Only ${product.stock} left in stock`);
                    return updatedCart;
                }

                updatedCart[existingIndex].qty = newQty;
                toast.success(`${product.name} quantity updated`);
            } else {
                if (product.stock && qty > product.stock) {
                    toast.error(`Only ${product.stock} left in stock`);
                    return updatedCart;
                }

                const newItem = {
                    lineId: Date.now(), // unique cart row id
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty,
                };
                updatedCart.push(newItem);
                // toast.success(`${product.name} added to cart`);
            }

            return updatedCart;
        });
    };

    /**
     * Remove product by lineId
     * - Decreases qty or removes entire row
     */
    const removeFromCart = (lineId, removeAll = false) => {
        setCart((prev) => {
            const updatedCart = [...prev];
            const index = updatedCart.findIndex((item) => item.lineId === lineId);

            if (index === -1) return updatedCart;

            if (removeAll || updatedCart[index].qty <= 1) {
                // toast.error(`${updatedCart[index].name} removed from cart`);
                updatedCart.splice(index, 1);
            } else {
                updatedCart[index].qty -= 1;
                // toast.info(`${updatedCart[index].name} quantity decreased`);
            }

            return updatedCart;
        });
    };

    /** Clear all items from cart */
    const clearCart = () => {
        setCart([]);
        toast.warn("Cart cleared");
    };

    /** Get quantity of a product in the cart */
    const getItemQuantity = (productId) => {
        const item = cart.find((i) => i.productId === productId);
        return item ? item.qty : 0;
    };

    /** Get total amount in cart */
    const getCartTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getItemQuantity,
                getCartTotal,
            }}
        >
            {children}
            <ToastContainer position="bottom-right" autoClose={2000} />
        </CartContext.Provider>
    );
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
