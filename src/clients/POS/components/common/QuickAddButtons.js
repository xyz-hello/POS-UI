// src/clients/POS/components/common/QuickAddButtons.js
import React, { useState, useEffect, useRef } from 'react';
import SelectableButton from './SelectableButton';

export default function QuickAddButtons({ products = [], onAdd }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const containerRef = useRef();

    // Click outside to deselect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedItem(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = (item) => {
        setSelectedItem(item.id);
        onAdd(item);
    };

    return (
        <div ref={containerRef} className="flex flex-wrap gap-3">
            {products.map((item) => (
                <SelectableButton
                    key={item.id}
                    onClick={() => handleClick(item)}
                    isSelected={selectedItem === item.id}
                    className="flex-col w-28 h-28 justify-center"
                >
                    <div className="text-center text-sm font-medium text-gray-700 truncate w-full">
                        {item.name}
                    </div>
                    <div className="text-center text-sm font-semibold text-brandGreen mt-1">
                        ₱{item.price}
                    </div>
                </SelectableButton>
            ))}
        </div>
    );
}
