import React from "react";

// Reusable Footer component
export default function Footer({
    company = "Zero One",
    year = new Date().getFullYear(),
    className = "",
    noBorder = false,
    noPadding = false
}) {
    // Construct the class string based on props
    const footerClasses = `
    ${!noBorder ? "border-t border-gray-200" : ""} 
    ${!noPadding ? "p-4" : ""} 
    text-[#0f1e40] text-xs text-center
    ${className}
  `;

    return (
        <div className={footerClasses}>
            &copy; {year} {company}
        </div>
    );
}
