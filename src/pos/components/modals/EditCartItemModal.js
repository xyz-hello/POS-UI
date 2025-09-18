import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/cartContext";

const EditCartItemModal = ({ item, onClose }) => {
    const { updateCartItem } = useCart();
    const [qty, setQty] = useState(item.qty);
    const [weight, setWeight] = useState(item.weight || "");
    const [error, setError] = useState("");

    const modalRef = useRef(null);
    const qtyInputRef = useRef(null);

    // Focus quantity input on open
    useEffect(() => {
        qtyInputRef.current?.focus();
    }, []);

    // Prevent background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    // Close modal when clicking outside
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Handle Enter key for saving
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") onClose();
    };

    const handleSave = () => {
        if (qty <= 0) {
            setError("Quantity must be at least 1");
            return;
        }
        if (item.soldByWeight && weight < 0) {
            setError("Weight cannot be negative");
            return;
        }

        updateCartItem(item.id, { qty, weight });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={handleOutsideClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1} // allow key events
        >
            <div
                ref={modalRef}
                className="bg-white rounded-xl p-6 w-80 shadow-lg transition-transform transform scale-100 sm:scale-105"
            >
                <h2 className="text-lg font-semibold mb-4">Edit {item.name}</h2>

                {/* Quantity */}
                <label className="block mb-2 text-sm font-medium">Quantity</label>
                <input
                    ref={qtyInputRef}
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                    min={1}
                />

                {/* Weight (optional) */}
                {item.soldByWeight && (
                    <>
                        <label className="block mb-2 text-sm font-medium">Weight (g)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                            min={0}
                        />
                    </>
                )}

                {/* Error message */}
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-brandGreen text-white rounded-lg hover:bg-brandGreenDark transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCartItemModal;
