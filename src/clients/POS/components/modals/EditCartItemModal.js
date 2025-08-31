import React, { useState } from "react";
import { useCart } from "../contexts/cartContext";

const EditCartItemModal = ({ item, onClose }) => {
    const { updateCartItem } = useCart();
    const [qty, setQty] = useState(item.qty);
    const [weight, setWeight] = useState(item.weight || "");

    const handleSave = () => {
        updateCartItem(item.id, { qty, weight });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Edit {item.name}</h2>

                {/* Quantity */}
                <label className="block mb-2 text-sm">Quantity</label>
                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                {/* Weight (optional) */}
                {item.soldByWeight && (
                    <>
                        <label className="block mb-2 text-sm">Weight (g)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mb-4"
                        />
                    </>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCartItemModal;
