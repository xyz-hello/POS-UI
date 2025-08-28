// src/clients/POS/components/layouts/MiddlePanel/MiddlePanel.js
import React, { useState, useEffect } from "react";
import BarcodeInput from "./BarcodeInput";
import QuickAddButtons from "../../common/QuickAddButtons";
import MenuTabs from "../../common/MenuTabs";
import ProductGrid from "../../product/ProductGrid";
import api from "../../../services/productApi";

export default function MiddlePanel({ orderItems, setOrderItems }) {
    const [barcode, setBarcode] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [quickAddItems, setQuickAddItems] = useState([]);
    const [categories, setCategories] = useState(["All"]);

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
                const cats = ["All", ...new Set(res.data.map(p => p.category))];
                setCategories(cats);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    // Fetch quick-add items
    useEffect(() => {
        const fetchQuickAdd = async () => {
            try {
                const res = await api.get("/products/quick-add");
                setQuickAddItems(res.data);
            } catch (err) {
                console.error("Error fetching quick-add products:", err);
            }
        };
        fetchQuickAdd();
    }, []);

    // Add item to order
    const handleAddItem = (item) => {
        const newItem = {
            ...item,
            quantity: 1,
            weight: item.soldByWeight ? 0 : null,
        };
        setOrderItems(prev => [...prev, newItem]);
    };

    // Barcode lookup
    const handleBarcodeEnter = () => {
        const found = products.find(p => p.barcode === barcode || p.name.toLowerCase() === barcode.toLowerCase());
        if (found) handleAddItem(found);
        setBarcode("");
    };

    return (
        <div className="flex-1 flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-2">
                <BarcodeInput
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onEnter={handleBarcodeEnter}
                />
                <QuickAddButtons products={quickAddItems} onAdd={handleAddItem} />
            </div>

            <MenuTabs
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <div className="flex-1 overflow-y-auto scroll-modern p-2">
                <ProductGrid
                    products={products.filter(
                        p => selectedCategory === "All" || p.category === selectedCategory
                    )}
                    onAdd={handleAddItem}
                />
            </div>
        </div>
    );
}
