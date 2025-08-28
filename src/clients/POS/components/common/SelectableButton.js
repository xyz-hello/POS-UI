import React from 'react';

export default function SelectableButton({ children, isSelected, onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center p-2 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200
          focus:outline-none ${isSelected ? 'ring-2 ring-brandGreen' : ''} ${className}`}
        >
            {children}
        </button>
    );
}
