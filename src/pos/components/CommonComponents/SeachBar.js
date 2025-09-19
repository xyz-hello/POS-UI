import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ViewToggle from "../../../components/CommonComponents/ViewToggle";
import { FiEdit } from "react-icons/fi";

export default function SearchBarWithToggle({ value, onChange, placeholder = "Search...", viewMode, onToggle, onEdit }) {
    return (
        <div className="sticky top-2 z-20 px-4 py-1 flex items-center">
            {/* Search input */}
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 border-2 border-gray-300 shadow-sm transition-all duration-200 w-1/2 focus-within:border-brandGreen">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-sm"
                />
            </div>

            {/* Action buttons (View Toggle + Edit Icon) */}
            <div className="ml-2 flex items-center space-x-2">
                <ViewToggle viewMode={viewMode} onToggle={onToggle} />

                {/* Edit icon styled like a button */}
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:bg-brandGreen hover:text-white transition-colors shadow-sm"
                >
                    <FiEdit className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
