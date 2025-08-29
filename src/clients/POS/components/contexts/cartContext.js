import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, qty = 1, weight = null) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.weight === weight);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.weight === weight
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { ...product, qty, weight }];
        });
    };

    const removeFromCart = (id, weight = null) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.weight === weight)));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
