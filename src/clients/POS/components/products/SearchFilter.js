import React from "react";

export default function SearchFilter({
    searchTerm,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange,
}) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border p-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-brandGreen"
            />

            {/* Food Menu */}
            <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition
              ${selectedCategory === cat
                                ? "bg-brandGreen text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
