import React from "react";

export default function QuickAddButtons({ onQuickAdd }) {
    // Define your bakery quick-add items
    const quickItems = [
        { id: "q1", name: "1pc Ensaymada", price: 25 },
        { id: "q2", name: "Dozen Pandesal", price: 50 },
        { id: "q3", name: "Loaf Bread", price: 60 },
        { id: "q4", name: "Cheese Roll", price: 20 },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {quickItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onQuickAdd(item)}
                    className="px-4 py-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 text-sm font-medium"
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
}
