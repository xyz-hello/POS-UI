import React from "react";

const InventoryTable = ({ inventories, onAdjust }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">Adjust Stock</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {inventories.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-800 font-medium">{inv.product_name}</td>
                        <td className="px-6 py-4 text-gray-700">{inv.quantity}</td>
                        <td className="px-6 py-4 flex gap-3">
                            <button
                                className="px-3 py-1 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                onClick={() => onAdjust(inv.id, +1)}
                            >
                                +
                            </button>
                            <button
                                className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                onClick={() => onAdjust(inv.id, -1)}
                                disabled={inv.quantity === 0}
                            >
                                -
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InventoryTable;
