import React from 'react';

export default function CustomWeightInput({ value, onChange }) {
    return (
        <div className="flex justify-start w-full">
            {/* Custom weight input for items sold by grams/kilos */}
            <input
                type="number"
                placeholder="Weight (grams)"
                value={value}
                onChange={onChange} // Updates parent state
                min="0"
                step="1"
                className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen shadow-sm"
            />
        </div>
    );
}
