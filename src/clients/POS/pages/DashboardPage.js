import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProductList from "../components/products/ProductList";
import CartSidebar from "../components/cart/CartSidebar";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <Header />

                {/* Content + Cart */}
                <div className="flex flex-1 overflow-hidden pt-16 px-6 pb-6 gap-6">

                    {/* Product List */}
                    <main className="flex-1 overflow-y-auto">
                        <ProductList />
                    </main>

                    {/* Cart Sidebar */}
                    <div className="mt-4">
                        <CartSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}

//reminder
// GET /products → replace mock product list.
// POST /cart → add item.
// PUT /cart/:id → update quantity.
// DELETE /cart/:id → remove item.
// GET /orders/:id → replace Order #12345