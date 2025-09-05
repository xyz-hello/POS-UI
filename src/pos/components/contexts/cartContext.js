import React, { createContext, useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // import toast
import "react-toastify/dist/ReactToastify.css";

// Create Cart Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Add item to cart
    const addToCart = (product, qty = 1, weight = null) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.weight === weight);
            if (existing) {
                toast.info(`Updated ${product.name} quantity`);
                return prev.map(item =>
                    item.id === product.id && item.weight === weight
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            toast.success(`${product.name} added to cart`);
            return [...prev, { ...product, qty, weight }];
        });
    };

    // Remove item from cart
    const removeFromCart = (id, weight = null) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.weight === weight)));
        toast.error("Item removed from cart");
    };

    // Clear all items in cart
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

// Hook to use CartContext
export const useCart = () => useContext(CartContext);
