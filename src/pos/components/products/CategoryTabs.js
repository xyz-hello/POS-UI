import React from "react";

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div
            role="tablist"
            className="flex gap-2 overflow-x-auto pb-2 pt-2" // add top padding so pills are fully visible
        >
            {categories.map((cat) => {
                const isSelected = selectedCategory === cat;

                return (
                    <button
                        key={cat}
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onSelectCategory(cat)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                            focus:outline-none focus:ring-1 focus:ring-brandGreen
                            ${isSelected
                                ? "bg-white text-brandGreen border-2 border-brandGreen"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }
                        `}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
}
