// src/components/inventory/InventoryGrid.js
import React from "react";

const InventoryGrid = ({ inventories, onAdjust }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {inventories.length === 0 ? (
            <p className="text-center text-gray-400 py-10 col-span-full">
                No inventory found.
            </p>
        ) : (
            inventories.map((inv) => (
                <div
                    key={inv.id}
                    className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md 
                     hover:shadow-lg transition-transform transform hover:-translate-y-1 
                     cursor-pointer relative"
                >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-gray-400 text-xl font-medium">
                            {inv.product_name[0]}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-[#081A4B]">{inv.product_name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {inv.quantity}</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            className="px-3 py-1 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdjust(inv.id, +1);
                            }}
                        >
                            +
                        </button>
                        <button
                            className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdjust(inv.id, -1);
                            }}
                            disabled={inv.quantity === 0}
                        >
                            -
                        </button>
                    </div>
                </div>
            ))
        )}
    </div>
);

export default InventoryGrid;
