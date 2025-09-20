// filepath: src/pages/InventoryPage.js
import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/CommonComponents/Header";
import Sidebar from "../components/CommonComponents/Sidebar";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryGrid from "../components/inventory/InventoryGrid";
import SearchBar from "../components/CommonComponents/SearchInput";
import ViewToggle from "../components/CommonComponents/ViewToggle";
import Pagination from "../components/CommonComponents/Pagination";
import EmptyState from "../components/CommonComponents/EmptyState";
import { getInventory, updateInventory } from "../services/inventoryServices";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Package } from "lucide-react";

const InventoryPage = () => {
    const [inventories, setInventories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // table or grid
    const inventoriesPerPage = 10;
    const token = localStorage.getItem("token");
    const uploadsBaseURL = "http://localhost:4000/uploads"; // match ProductList

    // Fetch inventory
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

    // Adjust inventory
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

    // Filter & paginate
    const filteredInventory = inventories.filter((inv) =>
        inv.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(filteredInventory.length / inventoriesPerPage), 1);

    const currentInventory = filteredInventory.slice(
        (currentPage - 1) * inventoriesPerPage,
        currentPage * inventoriesPerPage
    );

    useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [filteredInventory, totalPages, currentPage]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <aside className="w-64 h-screen flex-shrink-0 bg-white shadow overflow-y-auto"><Sidebar /></aside>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />
                <main className="flex-1 px-6 py-8 bg-gray-50 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <SearchBar
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                            disabled={loading}
                        />
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#1F2937]">Inventory List</h2>
                            <ViewToggle
                                viewMode={viewMode}
                                onToggle={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                            />
                        </div>

                        {loading ? (
                            <div>Loading...</div>
                        ) : viewMode === "table" ? (
                            <InventoryTable
                                inventories={currentInventory}
                                onAdjust={handleAdjust}
                                uploadsBaseURL={uploadsBaseURL}
                            />
                        ) : currentInventory.length === 0 ? (
                            <div className="flex flex-col justify-center items-center h-64">
                                <EmptyState icon={Package} message="No inventory found" size="lg" />
                            </div>
                        ) : (
                            <InventoryGrid
                                inventories={currentInventory}
                                onAdjust={handleAdjust}
                                uploadsBaseURL={uploadsBaseURL}
                            />
                        )}

                        <div className="flex flex-col items-center gap-2">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                {filteredInventory.length === 0
                                    ? 0
                                    : (currentPage - 1) * inventoriesPerPage + 1}{" "}
                                –{" "}
                                {Math.min(currentPage * inventoriesPerPage, filteredInventory.length)}{" "}
                                of {filteredInventory.length} items | Page {currentPage} of {totalPages}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InventoryPage;
