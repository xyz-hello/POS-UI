import React, { useState, useEffect } from "react";
import { mockProducts as MockData } from "../products/MockData";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickAddButtons({ onQuickAdd }) {
    const [quickItems, setQuickItems] = useState([]);

    useEffect(() => {
        // TEMP: pick first 8 products as Quick Add items
        const bestSellers = MockData.slice(0, 8);
        setQuickItems(bestSellers);
    }, []);

    // Base button classes with comments
    const buttonClasses = `
        px-4 py-3                        // spacing
        rounded-md                        // square/rectangle shape
        text-sm font-medium               // typography
        flex flex-col justify-center items-center  // vertical layout for name and price
        text-gray-700 bg-white            // default text and background color
        border border-gray-300            // border
        shadow-md                         // slight elevation
        transition-all duration-200       // smooth transitions
        hover:bg-gray-100                 // hover background
        focus:outline-none focus:ring-1 focus:ring-brandGreen  // focus effect
    `;

    return (
        <div className="quick-add-buttons grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            <AnimatePresence>
                {quickItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => onQuickAdd(item)}  // add to cart
                        className={buttonClasses}
                        initial={{ opacity: 0, y: 10 }}   // animate in from below
                        animate={{ opacity: 1, y: 0 }}    // final position
                        exit={{ opacity: 0, y: 10 }}      // animate out
                        whileHover={{ scale: 1.05 }}      // hover lift effect
                        whileTap={{ scale: 0.95 }}        // tap press effect
                        layout
                    >
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500">₱{item.price}</span>
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
    );
}
