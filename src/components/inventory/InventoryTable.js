import React, { useState } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci"; // modern circular plus/minus

export default function InventoryTable({ inventories = [], onReload }) {
    const [loadingIds, setLoadingIds] = useState([]); // track loading per product

    const handleUpdate = async (productId, action) => {
        setLoadingIds((prev) => [...prev, productId]);
        try {
            await axios.patch(`http://localhost:4000/api/admin/products/${productId}/inventory`, {
                action,
                amount: 1,
            });
            showSuccessToast("Inventory updated successfully.");
            onReload(); // refresh inventory list
        } catch (err) {
            console.error(err);
            showErrorToast("Failed to update inventory.");
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== productId));
        }
    };

    return (
        <table className="min-w-full border-collapse text-sm">
            <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border-b">Product Name</th>
                    <th className="px-4 py-2 border-b">Quantity</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {inventories.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{item.product_name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2 flex gap-2">
                            <CiCirclePlus
                                size={24}
                                className={`cursor-pointer transition-transform hover:scale-110 ${loadingIds.includes(item.id) ? "opacity-50 pointer-events-none" : "text-emerald-500 hover:text-emerald-600"
                                    }`}
                                onClick={() => handleUpdate(item.id, "increment")}
                            />

                            <CiCircleMinus
                                size={24}
                                className={`cursor-pointer transition-transform hover:scale-110 ${loadingIds.includes(item.id) || item.quantity <= 0
                                    ? "opacity-50 pointer-events-none"
                                    : "text-rose-500 hover:text-rose-600"
                                    }`}
                                onClick={() => handleUpdate(item.id, "decrement")}
                            />

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
