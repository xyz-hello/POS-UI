import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="sticky top-2 z-20 px-4 py-1">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-300 shadow-sm transition-all duration-200">
                {/* Search Icon */}
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />

                {/* Input Field */}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-sm"
                />
            </div>
        </div>
    );
}
