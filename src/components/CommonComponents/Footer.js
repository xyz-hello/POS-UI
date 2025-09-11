import React from "react";

// Reusable Footer component
export default function Footer({ company = "Zero One", year = new Date().getFullYear() }) {
    return (
        <div className="border-t border-gray-200 p-4 text-[#0f1e40] text-xs text-center">
            &copy; {year} {company}
        </div>
    );
}
