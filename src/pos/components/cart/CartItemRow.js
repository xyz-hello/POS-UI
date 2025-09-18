import React from "react";
import { Pencil, Trash2 } from "lucide-react";

// Single row in the cart sidebar, memoized to avoid unnecessary re-renders
function CartItemRow({ item, onEdit, onDelete, formatPrice }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-neutralBorder last:border-none">
            {/* Item info */}
            <p className="text-sm text-neutralDark truncate">
                {item.qty}× {item.name}
            </p>

            {/* Price + actions */}
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

// Only re-render if the item changes
export default React.memo(CartItemRow, (prev, next) => prev.item === next.item);
