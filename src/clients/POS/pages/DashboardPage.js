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
                {/* Header (fixed height, stays on top) */}
                <Header />

                {/* Content + Cart */}
                <div className="flex flex-1 gap-6 px-6 pb-6 pt-16 overflow-hidden">
                    {/* Product List (scrollable) */}
                    <main className="flex-1 overflow-y-auto">
                        <ProductList />
                    </main>

                    {/* Cart Sidebar (fixed width, full height of remaining space) */}
                    <aside className="w-72 flex flex-col mt-2">
                        <CartSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
