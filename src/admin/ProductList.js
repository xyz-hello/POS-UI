// filepath: src/pages/ProductList.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import MainLayout from "../components/CommonComponents/MainLayout";
import PrimaryButton from "../components/CommonComponents/PrimaryButton";
import SearchInput from "../components/CommonComponents/SearchInput";
import DeleteModal from "../components/CommonComponents/ConfirmationModal";
import AddProductModal from "../components/CommonComponents/AddProductModal";
import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";
import ViewToggle from "../components/CommonComponents/ViewToggle";
import Pagination from "../components/CommonComponents/Pagination";
import EmptyState from "../components/CommonComponents/EmptyState";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Package } from "lucide-react";

const ProductList = () => {
    // ---------------- State ----------------
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ type: null, product: null, open: false });
    const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
    const productsPerPage = 10;

    const baseURL = "http://localhost:4000/api/admin/products";
    const uploadsBaseURL = "http://localhost:4000/uploads";

    // ---------------- Axios Auth Helper ----------------
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token missing.");
        return { Authorization: `Bearer ${token}` };
    };

    // ---------------- Fetch Products ----------------
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(baseURL, { headers: getAuthHeaders() });
            setProducts(res.data || []);
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || "Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // ---------------- Search & Pagination ----------------
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(filteredProducts.length / productsPerPage), 1);
    console.log("Products:", filteredProducts.length, "Per page:", productsPerPage, "Total pages:", totalPages);


    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [filteredProducts, totalPages, currentPage]);


    // ---------------- Modal Helpers ----------------
    const openModal = (type, product = null) =>
        setModal({ type, product, open: true });
    const closeModal = () => setModal({ type: null, product: null, open: false });

    // ---------------- Delete Product ----------------
    const handleDeleteProduct = async () => {
        if (!modal.product) return;
        try {
            await axios.delete(`${baseURL}/${modal.product.id}`, { headers: getAuthHeaders() });
            setProducts((prev) => prev.filter((p) => p.id !== modal.product.id));
            closeModal();
            showSuccessToast("Product deleted successfully.");
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || "Failed to delete product.");
        }
    };

    // ---------------- Add / Edit Product ----------------
    const handleAddEditProduct = async (formData, isEdit = false) => {
        const url = isEdit ? `${baseURL}/${modal.product.id}` : baseURL;
        try {
            const res = isEdit
                ? await axios.put(url, formData, {
                    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
                })
                : await axios.post(url, formData, {
                    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
                });

            showSuccessToast(res.data.message || (isEdit ? "Product updated" : "Product added"));
            loadProducts();
            closeModal();
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || (isEdit ? "Failed to update" : "Failed to add"));
        }
    };

    // ---------------- Render ----------------
    return (
        <MainLayout>
            {/* Search + Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by product name..."
                />
                <PrimaryButton onClick={() => openModal("add")}>+ Add Product</PrimaryButton>
            </div>

            {/* Header + View Toggle */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1F2937]">Products List</h2>
                <ViewToggle
                    viewMode={viewMode}
                    onToggle={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                />
            </div>

            {/* Product Display */}
            {loading ? (
                <div>Loading...</div>
            ) : viewMode === "table" ? (
                <ProductTable
                    products={currentProducts}
                    onEdit={(p) => openModal("edit", p)}
                    onDelete={(p) => openModal("delete", p)}
                    uploadsBaseURL={uploadsBaseURL}
                />
            ) : currentProducts.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64">
                    <EmptyState icon={Package} message="No products found" size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {currentProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            uploadsBaseURL={uploadsBaseURL}
                            onEdit={() => openModal("edit", p)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col items-center gap-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
                <p className="text-sm text-gray-600">
                    Showing{" "}
                    {filteredProducts.length === 0
                        ? 0
                        : (currentPage - 1) * productsPerPage + 1}{" "}
                    –{" "}
                    {Math.min(currentPage * productsPerPage, filteredProducts.length)}{" "}
                    of {filteredProducts.length} items | Page {currentPage} of {totalPages}
                </p>
            </div>

            {/* Add / Edit / Delete Modals */}
            {modal.open && modal.type === "add" && (
                <AddProductModal editData={null} onClose={closeModal} onSubmit={handleAddEditProduct} isOpen />
            )}
            {modal.open && modal.type === "edit" && (
                <AddProductModal editData={modal.product} onClose={closeModal} onSubmit={(data) => handleAddEditProduct(data, true)} isOpen />
            )}
            {modal.open && modal.type === "delete" && (
                <DeleteModal
                    isOpen
                    onClose={closeModal}
                    onConfirm={handleDeleteProduct}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${modal.product?.name}"?`}
                    confirmText="Yes"
                    cancelText="No"
                    type="delete"
                />
            )}
        </MainLayout>
    );
};

export default ProductList;
