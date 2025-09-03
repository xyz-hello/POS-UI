import React, { useState, useEffect } from "react";
import { mockProducts as MockData } from "../products/MockData";
import { motion, AnimatePresence } from "framer-motion";
import WeightInputModal from "../modals/WeightInputModal"; // import modal

export default function QuickAddButtons({ onQuickAdd }) {
    const [quickItems, setQuickItems] = useState([]);
    const [showModal, setShowModal] = useState(false); // modal state
    const [activeItem, setActiveItem] = useState(null); // item to pass into modal

    useEffect(() => {
        // TEMP: pick first 8 products as Quick Add items
        const bestSellers = MockData.slice(0, 8);
        setQuickItems(bestSellers);
    }, []);

    const handleClick = (item) => {
        if (item.soldByWeight) {
            setActiveItem(item);
            setShowModal(true);
        } else {
            onQuickAdd(item);
        }
    };

    const handleConfirmWeight = (itemWithWeight) => {
        onQuickAdd(itemWithWeight);
    };

    // Base button classes
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
        <>
            <div className="quick-add-buttons grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                <AnimatePresence>
                    {quickItems.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleClick(item)}
                            className={buttonClasses}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            layout
                        >
                            <span>{item.name}</span>
                            <span className="text-xs text-gray-500">₱{item.price}</span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Weight Modal */}
            {showModal && (
                <WeightInputModal
                    item={activeItem}
                    onConfirm={handleConfirmWeight}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
