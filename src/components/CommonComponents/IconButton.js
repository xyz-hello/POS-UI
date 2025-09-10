// src/components/CommonComponents/IconButton.js
import React from "react";

/**
 * IconButton
 * Matches EXACT design of your inline Edit / Toggle / Delete buttons
 */
const IconButton = ({ icon: Icon, onClick, title, variant }) => {
    // Variant-specific classes (copied directly from your inline buttons)
    const variants = {
        edit: "text-white bg-[#081A4B] p-1 rounded-md hover:bg-[#061533]", // dark blue background
        delete: "text-red-500 hover:text-red-700",                        // red text, hover darker
        "toggle-on": "text-green-500",                                    // green for active
        "toggle-off": "text-gray-400",                                    // gray for inactive
    };

    // Exact icon sizes from your inline code
    const iconSizes = {
        edit: 14,
        delete: 18,
        "toggle-on": 30,
        "toggle-off": 30,
    };

    return (
        <button
            onClick={onClick}
            className={variants[variant]}
            title={title}
        >
            <Icon size={iconSizes[variant]} />
        </button>
    );
};

export default IconButton;
