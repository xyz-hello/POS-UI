import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

function CartItemRow({ item, onEdit, onDelete, formatPrice, highlightKey }) {
    const [highlight, setHighlight] = useState(false);

    useEffect(() => {
        // If this row matches the highlightKey, animate
        if (highlightKey === (item.lineId || item.id)) {
            setHighlight(true);
            const timer = setTimeout(() => setHighlight(false), 800); // highlight duration
            return () => clearTimeout(timer);
        }
    }, [highlightKey, item.lineId, item.id]);

    return (
        <div
            className={`flex justify-between items-center py-1.5 border-b border-neutralBorder last:border-none transition-colors duration-500
                ${highlight ? "bg-green-100" : "bg-white"}`}
        >
            <p className="text-sm text-neutralDark truncate">
                {item.qty}× {item.name}
            </p>
            <div className="flex items-center space-x-1">
                <p className="text-sm font-semibold text-neutralDark">
                    {formatPrice(item.price * item.qty)}
                </p>
                <button
                    onClick={onEdit}
                    className="text-neutralGray hover:text-brandGreenDark transition"
                    title="Edit item"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={onDelete}
                    className="text-neutralGray hover:text-red-600 transition"
                    title="Remove item"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default React.memo(
    CartItemRow,
    (prev, next) => prev.item === next.item && prev.highlightKey === next.highlightKey
);
