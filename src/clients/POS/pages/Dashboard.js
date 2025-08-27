import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MiddlePanel from "../components/MiddlePanel/MiddlePanel";
import OrderLinePreview from "../components/Cart/OrderLinePreview";

export default function POSDashboard() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [collapsed, setCollapsed] = useState(false);

    const [orderItems, setOrderItems] = useState([]);

    const updateQuantity = (id, qty) => {
        setOrderItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    };

    const updateWeight = (id, weight) => {
        setOrderItems(prev => prev.map(item => item.id === id ? { ...item, weight } : item));
    };

    const removeItem = (id) => {
        setOrderItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar active={activeMenu} onMenuClick={setActiveMenu} collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col">
                <Header />

                <div className="flex flex-1 mt-20 p-5 gap-5 overflow-hidden">
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col overflow-auto">
                        <MiddlePanel orderItems={orderItems} setOrderItems={setOrderItems} />
                    </div>

                    <div className="w-96 flex-shrink-0">
                        <OrderLinePreview
                            items={orderItems}
                            onQuantityChange={updateQuantity}
                            onWeightChange={updateWeight}
                            onRemove={removeItem}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
