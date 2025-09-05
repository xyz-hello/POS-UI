import React, { useState } from "react";
import { ScanLine, Search } from "lucide-react"; // icons

// Reusable input for Barcode/PLU lookup
export default function BarcodeInput({ onSearch }) {
    const [barcode, setBarcode] = useState("");

    // Handle form submission (Enter key or button click)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        // If using API in the future:
        // const product = await fetch(`/api/products/${barcode}`).then(res => res.json());
        // onSearch(product);

        // For now, pass barcode back to parent (mock/local lookup)
        onSearch(barcode);

        // Clear input after search
        setBarcode("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-4 mt-6 flex items-center gap-2 ml-6"
        >
            {/* Input with scan icon */}
            <div className="relative w-full max-w-sm">
                <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Barcode/PLU for packaged bread & pastries"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-neutralBorder focus:ring-2 focus:ring-brandGreen outline-none"
                />
            </div>

            {/* Submit button with magnifying glass */}
            <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-brandGreen 
                            border border-brandGreen bg-white shadow hover:bg-gray-100 
                             focus:outline-none focus:ring-2 focus:ring-brandGreen transition-colors">
                <Search className="h-4 w-4" />
                Search
            </button>
        </form>
    );
}
