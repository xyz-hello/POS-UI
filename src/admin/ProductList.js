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
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ProductList = () => {
    // ---------------- State ----------------
    const [products, setProducts] = useState([]); // all products from backend
    const [searchTerm, setSearchTerm] = useState(""); // search query
    const [currentPage, setCurrentPage] = useState(1); // current pagination page
    const [loading, setLoading] = useState(false); // loading state
    const [modal, setModal] = useState({ type: null, product: null, open: false }); // modal data
    const [viewMode, setViewMode] = useState("table"); // toggle between "table" or "grid"
    const productsPerPage = 5; // number of products per page

    const baseURL = "http://localhost:4000/api/admin/products";
    const uploadsBaseURL = "http://localhost:4000/uploads";

    // ---------------- Axios Auth Helper ----------------
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token missing.");
        return { Authorization: `Bearer ${token}` };
    };

    // ---------------- Fetch Products from API ----------------
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(baseURL, { headers: getAuthHeaders() });
            setProducts(res.data || []); // update state with fetched products
        } catch (err) {
            console.error(err);
            showErrorToast(err.response?.data?.message || "Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch products when component mounts
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // ---------------- Search & Pagination ----------------
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(
        Math.ceil(filteredProducts.length / productsPerPage),
        1
    );

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Reset to first page if current page exceeds available pages
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
            // Call backend delete
            await axios.delete(`${baseURL}/${modal.product.id}`, {
                headers: getAuthHeaders(),
            });

            // Remove product from state immediately
            setProducts((prev) =>
                prev.filter((p) => p.id !== modal.product.id)
            );

            closeModal();
            showSuccessToast("Product deleted successfully.");
        } catch (err) {
            console.error(err);
            showErrorToast(
                err.response?.data?.message || "Failed to delete product."
            );
        }
    };

    // ---------------- Add / Edit Product ----------------
    const handleAddEditProduct = async (formData, isEdit = false) => {
        const url = isEdit ? `${baseURL}/${modal.product.id}` : baseURL;
        try {
            const res = isEdit
                ? await axios.put(url, formData, {
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "multipart/form-data",
                    },
                })
                : await axios.post(url, formData, {
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "multipart/form-data",
                    },
                });

            showSuccessToast(
                res.data.message || (isEdit ? "Product updated" : "Product added")
            );

            // Reload products after add/edit
            loadProducts();
            closeModal();
        } catch (err) {
            console.error(err);
            showErrorToast(
                err.response?.data?.message ||
                (isEdit ? "Failed to update" : "Failed to add")
            );
        }
    };

    // ---------------- Render ----------------
    return (
        <MainLayout>
            {/* Search + Add Product Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <SearchInput
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // reset to first page when searching
                    }}
                    placeholder="Search by product name..."
                />
                <PrimaryButton onClick={() => openModal("add")}>
                    + Add Product
                </PrimaryButton>
            </div>

            {/* Header + View Toggle */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1F2937]">Products List</h2>
                <ViewToggle
                    viewMode={viewMode}
                    onToggle={() =>
                        setViewMode(viewMode === "table" ? "grid" : "table")
                    }
                />
            </div>

            {/* Product Display (table or grid) */}
            {loading ? (
                <div>Loading...</div>
            ) : viewMode === "table" ? (
                <ProductTable
                    products={currentProducts}
                    onEdit={(p) => openModal("edit", p)}
                    onDelete={(p) => openModal("delete", p)}
                    uploadsBaseURL={uploadsBaseURL}
                />
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Add Product Modal */}
            {modal.open && modal.type === "add" && (
                <AddProductModal
                    editData={null}
                    onClose={closeModal}
                    onSubmit={(data) => handleAddEditProduct(data)}
                    isOpen
                />
            )}

            {/* Edit Product Modal */}
            {modal.open && modal.type === "edit" && (
                <AddProductModal
                    editData={modal.product}
                    onClose={closeModal}
                    onSubmit={(data) => handleAddEditProduct(data, true)}
                    isOpen
                />
            )}

            {/* Delete Confirmation Modal */}
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
