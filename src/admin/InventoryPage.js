import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/CommonComponents/Header";
import Sidebar from "../components/CommonComponents/Sidebar";
import InventoryTable from "../components/inventory/InventoryTable";
import { showErrorToast } from "../utils/toast";
import { getInventory } from "../services/inventoryServices";

const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const token = localStorage.getItem("token");

    const loadInventory = useCallback(async () => {
        if (!token) return showErrorToast("JWT token missing.");
        try {
            const data = await getInventory(token);

            const mappedData = Array.isArray(data)
                ? data.map((p) => ({
                    id: p.id,
                    product_name: p.name,
                    quantity: p.Inventory?.quantity || 0,
                }))
                : [];

            setInventories(mappedData);
        } catch (err) {
            showErrorToast("Failed to fetch inventory.");
        }
    }, [token]);

    useEffect(() => { loadInventory(); }, [loadInventory]);

    const filteredInventories = inventories.filter((i) =>
        i.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(filteredInventories.length / itemsPerPage), 1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInventories = filteredInventories.slice(indexOfFirstItem, indexOfLastItem);

    const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-8 bg-gray-50">
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                    />

                    <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Inventory List</h2>

                    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                        {currentInventories.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">No inventory found.</p>
                        ) : (
                            <InventoryTable inventories={currentInventories} onReload={loadInventory} />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center items-center gap-1">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-2 py-1 rounded-md text-xs font-medium bg-[#081A4B] text-white">Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className="px-2 py-1 rounded-md text-xs font-semibold border bg-white text-[#081A4B]">{i + 1}</button>
                        ))}
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1 rounded-md text-xs font-medium bg-[#081A4B] text-white">Next</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InventoryPage;
