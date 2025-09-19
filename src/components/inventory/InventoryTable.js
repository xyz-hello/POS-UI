// filepath: src/components/inventory/InventoryTable.js
import React from "react";
import EmptyState from "../CommonComponents/EmptyState";
import { Package } from "lucide-react";

export default function InventoryTable({ inventories = [], onAdjust }) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-[#081A4B] text-white text-xs uppercase">
                    <tr>
                        <th className="px-3 py-2 text-left">Product Name</th>
                        <th className="px-3 py-2 text-left">Quantity</th>
                        <th className="px-3 py-2 text-center">Adjust Stock</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {inventories.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-3 py-6 text-center text-gray-500"
                            >
                                {/* Use default EmptyState for bigger consistent icon */}
                                <EmptyState
                                    icon={Package}
                                    message="No inventory found."
                                />
                            </td>
                        </tr>
                    ) : (
                        inventories.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2 font-medium text-gray-900">
                                    {inv.product_name}
                                </td>
                                <td className="px-3 py-2 text-gray-800">
                                    {inv.quantity}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <div className="inline-flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                                            onClick={() => onAdjust(inv.id, +1)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition disabled:opacity-50"
                                            onClick={() => onAdjust(inv.id, -1)}
                                            disabled={inv.quantity === 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
