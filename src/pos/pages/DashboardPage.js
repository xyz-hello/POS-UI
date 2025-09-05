import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProductList from "../components/products/ProductList";
import CartSidebar from "../components/cart/CartSidebar";
import BarcodeInput from "../components/products/BarcodeInput";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Header (fixed height) */}
                <Header className="fixed top-0 left-0 right-0 h-16 z-50" />

                {/* Content + Cart */}
                <div className="flex flex-1 gap-6 px-6 pb-6 pt-16 overflow-hidden">
                    {/* Product List (scrollable) */}
                    <main className="flex-1 overflow-y-auto scrollbar-thin">
                        {/* Top Section */}
                        <div className="mb-6">
                            <BarcodeInput onSearch={(code) => console.log("Scanned:", code)} />
                            {/* CategoryTabs */}
                        </div>

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
