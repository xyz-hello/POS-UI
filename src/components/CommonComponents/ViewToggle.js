// src/components/CommonComponents/ViewToggle.js
import React from "react";
import { CiGrid41, CiGrid2H } from "react-icons/ci";

const ViewToggle = ({ viewMode, onToggle }) => (
    <button
        onClick={onToggle}
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md 
               shadow hover:bg-gray-100 transition"
        title="Toggle View"
    >
        {viewMode === "table" ? (
            <CiGrid41 size={18} className="text-[#081A4B]" /> // shows grid icon when in table mode
        ) : (
            <CiGrid2H size={18} className="text-[#081A4B]" /> // shows table icon when in grid mode
        )}
    </button>
);

export default ViewToggle;
