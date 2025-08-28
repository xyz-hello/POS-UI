import React from 'react';
import QuantityControls from '../common/QuantityControls';
import SelectableButton from '../common/SelectableButton';

export default function ProductCard({ product, quantity, setQuantity, isSelected, onSelect, onAdd }) {
    if (!product) return null;

    const handleClick = () => {
        if (quantity > 0) {
            onAdd(product.id); // parent adds product with current quantity
            // quantity remains so user can add again
        } else {
            onSelect(product.id); // toggle selection
        }
    };

    return (
        <SelectableButton
            isSelected={isSelected}
            onClick={handleClick}
            className="flex-col w-full"
        >
            <img
                src={product.image || '/images/placeholder.png'}
                alt={product.name || 'Unnamed Product'}
                className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-100"
            />
            <div className="text-center text-sm font-semibold text-gray-700 uppercase tracking-wide truncate w-full">
                {product.name || 'Unnamed Product'}
            </div>
            <div className="text-center text-sm font-semibold text-brandGreen mt-1">
                ₱{product.price ?? 0}
            </div>
            <QuantityControls
                quantity={quantity}
                onIncrease={() => setQuantity(quantity + 1)}
                onDecrease={() => setQuantity(Math.max(quantity - 1, 0))}
                onReset={() => setQuantity(0)}
            />
        </SelectableButton>
    );
}
