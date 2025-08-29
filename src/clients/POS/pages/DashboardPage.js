// Dashboard.js
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ProductList from "../components/products/ProductList"; //product grid
import { useCart } from "../components/contexts/cartContext";

export default function Dashboard() {
    const { cart } = useCart(); // get current cart state

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar (navigation / categories) */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header (top bar with logo/user/logout/etc.) */}
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    {/* Product Grid Section */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <ProductList />
                    </main>

                    {/* Order Summary (cart on the right) */}
                    <aside className="w-80 border-l bg-white p-6 hidden md:flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <p className="text-gray-400">No items yet</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cart.map((item) => (
                                        <li key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>₱{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button className="mt-4 bg-[#15803d] text-white py-3 rounded-xl shadow hover:bg-green-700">
                            Checkout
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
