import React from 'react';

export default function QuickAddButtons({ onAdd }) {
    const items = [
        { name: 'Ensaymada', price: 25 },
        { name: 'Pandesal', price: 12 },
        { name: 'Dozen Pandesal', price: 120 },
        { name: 'Cheese Roll', price: 18 },
        { name: 'Bun de Leche', price: 20 },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onAdd(item)}
                    className="flex flex-col items-center justify-center w-28 h-28 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                >
                    <div className="text-sm font-medium text-gray-700">{item.name}</div>
                    <div className="text-green-600 font-semibold mt-1">₱{item.price}</div>
                </button>
            ))}
        </div>
    );
}
