import React, { createContext, useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Add product to cart - stack by productId
    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const updatedCart = [...prev];

            // Find existing item with same productId
            const existingIndex = updatedCart.findIndex(
                item => item.productId === product.id
            );

            if (existingIndex !== -1) {
                // Optional: check stock if available
                // const newQty = updatedCart[existingIndex].qty + qty;
                // if (product.stock && newQty > product.stock) {
                //     toast.error("Not enough stock");
                //     return updatedCart;
                // }

                // Product exists, stack quantity
                updatedCart[existingIndex].qty += qty;
                toast.success(`${product.name} quantity updated`);
            } else {
                // New product, add to cart
                const newItem = {
                    lineId: Date.now(),  // unique cart row
                    productId: product.id, // backend product id
                    name: product.name,
                    price: product.price,
                    qty,
                };
                updatedCart.push(newItem);
                toast.success(`${product.name} added to cart`);
            }

            return updatedCart;
        });
    };

    // Remove one quantity or full line by lineId
    const removeFromCart = (lineId, removeAll = false) => {
        setCart(prev => {
            const updatedCart = [...prev];
            const index = updatedCart.findIndex(item => item.lineId === lineId);

            if (index === -1) return updatedCart;

            if (removeAll || updatedCart[index].qty <= 1) {
                // Remove entire row
                updatedCart.splice(index, 1);
                toast.error("Item removed from cart");
            } else {
                // Decrease quantity
                updatedCart[index].qty -= 1;
                toast.info(`${updatedCart[index].name} quantity decreased`);
            }

            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        toast.warn("Cart cleared");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
            <ToastContainer position="bottom-right" autoClose={2000} />
        </CartContext.Provider>
    );
};

// Hook to access cart in components
export const useCart = () => useContext(CartContext);
