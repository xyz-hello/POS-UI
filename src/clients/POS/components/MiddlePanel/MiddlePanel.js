import React, { useState } from "react";
import BarcodeInput from "./BarcodeInput";
import QuickAddButtons from "./QuickAddButtons";
import MenuTabs from "./MenuTabs";
import ProductGrid from "./ProductGrid";

export default function MiddlePanel({ orderItems, setOrderItems }) {
    const [barcode, setBarcode] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Bread", "Pastry", "Cakes"];
    const products = [
        { id: 1, name: "Ensaymada", category: "Pastry", price: 25, soldByWeight: false },
        { id: 2, name: "Pandesal", category: "Bread", price: 12, soldByWeight: false },
        { id: 3, name: "Chocolate Cake", category: "Cakes", price: 150, soldByWeight: true },
    ];

    const handleAddItem = (item) => {
        const newItem = {
            ...item,
            quantity: 1,
            weight: item.soldByWeight ? 0 : null
        };
        setOrderItems(prev => [...prev, newItem]);
    };

    const handleBarcodeEnter = () => {
        const found = products.find(p => p.name.toLowerCase() === barcode.toLowerCase());
        if (found) handleAddItem(found);
        setBarcode("");
    };

    return (
        <div className="flex-1 flex flex-col gap-4">
            {/* Top Inputs */}
            <div className="flex flex-col gap-2">
                <BarcodeInput value={barcode} onChange={e => setBarcode(e.target.value)} onEnter={handleBarcodeEnter} />
                <QuickAddButtons onAdd={handleAddItem} />
            </div>

            {/* Tabs */}
            <MenuTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Products */}
            <ProductGrid
                products={products.filter(p => selectedCategory === "All" || p.category === selectedCategory)}
                onSelect={handleAddItem}
            />
        </div>
    );
}
