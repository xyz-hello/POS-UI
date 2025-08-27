import React from 'react';
import BarcodeInput from './BarcodeInput';
import CustomWeightInput from './CustomWeightInput';

export default function TopInputs({ barcode, setBarcode, onEnter, weight, setWeight }) {
    return (
        <div className="flex gap-2 mb-4 w-full items-center">
            {/* Barcode input expands */}
            <div className="flex-1">
                <BarcodeInput
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onEnter={onEnter}
                />
            </div>

            {/* Weight input fixed width, right beside barcode */}
            <div className="w-36">
                <CustomWeightInput
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>
        </div>
    );
}
