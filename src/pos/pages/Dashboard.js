// filepath: src/pos/pages/Dashboard.js
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProductList from "../pages/productList";
import CartSidebar from "../components/cart/CartSidebar";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* ---------------- Sidebar ---------------- */}
            <Sidebar />

            {/* ---------------- Main Content Area ---------------- */}
            <div className="flex flex-col flex-1">
                {/* Header: fixed at top */}
                <Header className="fixed top-0 left-0 right-0 h-16 z-50" />

                {/* Main Section: Product List + Cart */}
                <div className="flex flex-1 gap-6 px-6 pt-16 pb-6 overflow-hidden">

                    {/* Scrollable Product List */}
                    <main className="flex-1 overflow-y-auto scrollbar-thin">
                        <ProductList />
                    </main>

                    {/* Cart Sidebar */}
                    <aside className="w-72 flex flex-col">
                        <CartSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
