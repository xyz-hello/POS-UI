import React from 'react';

export default function MenuTabs({ categories, onSelect }) {
    return (
        <div className="mb-4 flex gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className="px-3 py-1 border rounded-lg"
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
