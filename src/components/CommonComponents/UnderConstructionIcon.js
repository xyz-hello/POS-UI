// src/components/CommonComponents/UnderConstructionIcon.js
import React from "react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

// This component renders a large "Under Construction" icon
export default function UnderConstructionIcon({ size = 100, className = "" }) {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <WrenchScrewdriverIcon className={`text-gray-400`} style={{ width: size, height: size }} />
            <span className="mt-4 text-gray-500 text-xl font-medium">Under Construction</span>
        </div>
    );
}
