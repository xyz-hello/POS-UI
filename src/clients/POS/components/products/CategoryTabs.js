import React from "react";

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-brandGreen
            ${selectedCategory === cat
                            ? "bg-white text-brandGreen border-2 border-brandGreen"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }
          `}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
