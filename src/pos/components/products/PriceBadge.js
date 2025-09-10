import React from "react";

// Small reusable badge to show product price
export default function PriceBadge({ price }) {
    return (
        <span className="absolute top-2 right-2 bg-brandGreen text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
            {price}
        </span>
    );
}
