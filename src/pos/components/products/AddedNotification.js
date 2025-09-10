import React from "react";
import { motion } from "framer-motion";

// Animated feedback shown when item is added
export default function AddedNotification() {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.5 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-brandGreen text-white text-xs font-bold px-2 py-1 rounded-full shadow"
        >
            Added!
        </motion.span>
    );
}
