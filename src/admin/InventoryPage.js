import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/CommonComponents/Header";
import Sidebar from "../components/CommonComponents/Sidebar";
import InventoryTable from "../components/inventory/InventoryTable";
import { getInventory, updateInventory } from "../services/inventoryServices";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { CiGrid41 } from "react-icons/ci";

const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // table or grid
    const inventoriesPerPage = 5;
    const token = localStorage.getItem("token");

    // ---------------- Fetch Inventory ----------------
    const loadInventory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInventory(token);
            setInventories(data || []);
        } catch (err) {
            console.error(err);
            showErrorToast("Failed to fetch inventory.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadInventory(); }, [loadInventory]);

    // ---------------- Reusable Adjust Function ----------------
    const handleAdjust = async (productId, change) => {
        if (!token) return showErrorToast("JWT token missing. Please login.");
        try {
            await updateInventory(productId, change, token);
            showSuccessToast(`Inventory ${change > 0 ? "increased" : "decreased"}`);
            loadInventory();
        } catch (err) {
            console.error(err);
            showErrorToast(err.message || "Failed to update inventory");
        }
    };

    // ---------------- Filter & Pagination ----------------
    const filteredInventory = inventories.filter(inv =>
        inv.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.max(Math.ceil(filteredInventory.length / inventoriesPerPage), 1);
    const paginate = (items) => items.slice((currentPage - 1) * inventoriesPerPage, currentPage * inventoriesPerPage);
    const currentInventory = paginate(filteredInventory);

    useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [filteredInventory, currentPage, totalPages]);
    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-8 bg-gray-50">

                    {/* Search Input */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            disabled={loading}
                            className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                        />
                    </div>

                    {/* Header + View Toggle */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#1F2937]">Inventory List</h2>
                        <button
                            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
                            title="Toggle View"
                        >
                            <CiGrid41 size={18} className="text-[#081A4B]" />
                        </button>
                    </div>

                    {/* Inventory Display */}
                    {viewMode === "table" ? (
                        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                            {currentInventory.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">No inventory found.</p>
                            ) : (
                                <InventoryTable
                                    inventories={currentInventory}
                                    onAdjust={handleAdjust} // pass reusable function
                                />
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {currentInventory.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 col-span-full">No inventory found.</p>
                            ) : currentInventory.map(inv => (
                                <div
                                    key={inv.id}
                                    className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer relative"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                        <span className="text-gray-400 text-xl font-medium">{inv.product_name[0]}</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#081A4B]">{inv.product_name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Qty: {inv.quantity}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            className="px-3 py-1 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                            onClick={(e) => { e.stopPropagation(); handleAdjust(inv.id, +1); }}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                            onClick={(e) => { e.stopPropagation(); handleAdjust(inv.id, -1); }}
                                            disabled={inv.quantity === 0}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center items-center gap-1">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#081A4B] hover:bg-[#061533] text-white"}`}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === i + 1 ? "bg-[#081A4B] text-white border-[#081A4B]" : "bg-white text-[#081A4B] border border-[#081A4B] hover:bg-gray-100"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#081A4B] hover:bg-[#061533] text-white"}`}
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InventoryPage;
