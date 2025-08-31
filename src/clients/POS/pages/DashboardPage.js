import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProductList from "../components/products/ProductList";
import CartSidebar from "../components/cart/CartSidebar";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6">
                        <ProductList />
                    </main>

                    <CartSidebar /> {/* clean import here */}
                </div>
            </div>
        </div>
    );
}
