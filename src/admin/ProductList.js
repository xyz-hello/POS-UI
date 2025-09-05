// filepath: src/admin/ProductList.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DeleteModal from "../components/CommonComponents/ConfirmationModal";
import AddProductModal from "../components/CommonComponents/AddProductModal";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import Header from "../components/CommonComponents/Header";
import Sidebar from "../components/CommonComponents/Sidebar";
import ProductTable from "../components/products/ProductTable";
import { CiGrid41 } from "react-icons/ci";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [modalState, setModalState] = useState({
        type: null,
        product: null,
        open: false,
    });

    const [viewMode, setViewMode] = useState("table"); // table | gallery
    const productsPerPage = 5;
    const baseURL = "http://localhost:4000/api/admin/products";

    // ---------------- Fetch products ----------------
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(baseURL);
            setProducts(res.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            showErrorToast("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // ---------------- Filter & Pagination ----------------
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(filteredProducts.length / productsPerPage), 1);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [filteredProducts, currentPage, totalPages]);

    // ---------------- Modal Handlers ----------------
    const closeModal = () => setModalState({ type: null, product: null, open: false });
    const handleAddProduct = () => setModalState({ type: "add", product: null, open: true });
    const handleEditProduct = (product) => setModalState({ type: "edit", product, open: true });

    // ---------------- Delete Product ----------------
    const handleConfirmDelete = async () => {
        if (!modalState.product) return;
        try {
            await axios.delete(`${baseURL}/${modalState.product.id}`);
            setProducts((prev) => prev.filter((p) => p.id !== modalState.product.id));
            closeModal();
            showSuccessToast("Product deleted successfully.");
        } catch (error) {
            console.error("Error deleting product:", error);
            showErrorToast("Failed to delete product.");
        }
    };

    // ---------------- Add / Edit Product Submit ----------------
    const handleAddProductSubmit = async (formData) => {
        try {
            await axios.post(baseURL, formData); // let Axios set multipart/form-data automatically
            showSuccessToast("Product added successfully.");
            loadProducts();
            closeModal();
        } catch (err) {
            console.error(err);
            showErrorToast("Failed to add product.");
        }
    };

    const handleEditProductSubmit = async (formData) => {
        if (!modalState.product) return;
        try {
            await axios.put(`${baseURL}/${modalState.product.id}`, formData);
            showSuccessToast("Product updated successfully.");
            loadProducts();
            closeModal();
        } catch (err) {
            console.error(err);
            showErrorToast("Failed to update product.");
        }
    };

    // ---------------- Pagination ----------------
    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

    // ---------------- Render ----------------
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 px-6 py-8 bg-gray-50">

                    {/* Search + Add */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            disabled={loading}
                            className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                        />
                        <button
                            onClick={handleAddProduct}
                            disabled={loading}
                            className="bg-[#081A4B] hover:bg-[#061533] text-white px-6 py-2 rounded-md font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            + Add Product
                        </button>
                    </div>

                    {/* Product List Header with view toggle on right */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#1F2937]">Products List</h2>
                        <button
                            onClick={() => setViewMode(viewMode === "table" ? "gallery" : "table")}
                            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
                            title="Toggle View"
                        >
                            <CiGrid41 size={18} className="text-[#081A4B]" />
                        </button>
                    </div>

                    {/* Product Display */}
                    {viewMode === "table" ? (
                        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                            {currentProducts.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">No products found.</p>
                            ) : (
                                <ProductTable
                                    products={currentProducts}
                                    onEdit={handleEditProduct}
                                    onDelete={(product) => setModalState({ type: "delete", product, open: true })}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {currentProducts.length === 0 ? (
                                <p className="text-center text-gray-400 py-10 col-span-full">No products found.</p>
                            ) : (
                                currentProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                            {product.image ? (
                                                <img
                                                    src={product.image} // <- use backend-provided URL
                                                    alt={product.name}
                                                    className="object-cover w-full h-full rounded-lg"
                                                    onError={(e) => { e.target.src = ""; }}
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xl">{product.name[0]}</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-[#081A4B]">{product.name}</p>
                                        <p className="text-xs text-gray-500">${product.price}</p>
                                    </div>
                                ))
                            )}
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

            {/* Modals */}
            {modalState.open && modalState.type === "add" && (
                <AddProductModal editData={null} onClose={closeModal} onSubmit={handleAddProductSubmit} isOpen />
            )}
            {modalState.open && modalState.type === "edit" && (
                <AddProductModal editData={modalState.product} onClose={closeModal} onSubmit={handleEditProductSubmit} isOpen />
            )}
            {modalState.open && modalState.type === "delete" && (
                <DeleteModal
                    isOpen
                    onClose={closeModal}
                    onConfirm={handleConfirmDelete}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${modalState.product?.name}"?`}
                    confirmText="Yes"
                    cancelText="No"
                    type="delete"
                />
            )}
        </div>
    );
};

export default ProductList;
