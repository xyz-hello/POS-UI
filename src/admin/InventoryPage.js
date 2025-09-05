import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../components/CommonComponents/Header";
import Sidebar from "../components/CommonComponents/Sidebar";
import InventoryTable from "../components/inventory/InventoryTable";
import { showErrorToast } from "../utils/toast";

const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const baseURL = "http://localhost:4000/api/admin/products";

    // ---------------- Fetch inventory ----------------
    const loadInventory = useCallback(async () => {
        try {
            const res = await axios.get(baseURL); // assumes API returns products with inventory
            // Optional: map to include quantity and product name for table
            const data = res.data.map((p) => ({
                id: p.id,
                product_name: p.name,
                quantity: p.Inventory?.quantity || 0,
            }));
            setInventories(data);
        } catch (err) {
            console.error(err);
            showErrorToast("Failed to fetch inventory.");
        }
    }, []);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    // ---------------- Filter & Pagination ----------------
    const filteredInventories = inventories.filter((i) =>
        i.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(filteredInventories.length / itemsPerPage), 1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInventories = filteredInventories.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [filteredInventories, currentPage, totalPages]);

    // ---------------- Pagination Controls ----------------
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    // ---------------- Render ----------------
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-8 bg-gray-50">
                    {/* Search */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Inventory List</h2>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                        {currentInventories.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">No inventory found.</p>
                        ) : (
                            <InventoryTable
                                inventories={currentInventories}
                                onReload={loadInventory}
                            />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center items-center gap-1">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#081A4B] hover:bg-[#061533] text-white"
                                }`}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === i + 1
                                    ? "bg-[#081A4B] text-white border-[#081A4B]"
                                    : "bg-white text-[#081A4B] border border-[#081A4B] hover:bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#081A4B] hover:bg-[#061533] text-white"
                                }`}
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
