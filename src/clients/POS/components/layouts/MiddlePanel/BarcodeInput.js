import React from 'react';

export default function BarcodeInput({ value, onChange, onEnter }) {
    return (
        <div className="flex justify-start w-full">
            {/* Barcode / PLU input */}
            <input
                type="text"
                placeholder="Scan or enter PLU / Barcode"
                value={value}
                onChange={onChange} // Updates parent state as user types
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onEnter(); // Trigger action when Enter is pressed
                }}
                className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen shadow-sm"
            />
        </div>
    );
}
