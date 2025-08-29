import React from "react";

// Reusable component for a single product
export default function ProductCard({ product }) {
    return (
        <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
            {/* Product Image */}
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
            />

            {/* Product Name */}
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

            {/* Product Price */}
            <p className="text-gray-600 mb-3">₱{product.price}</p>

            {/* Action Button */}
            <button className="bg-brandGreen text-white px-4 py-2 rounded-md w-full hover:bg-green-700 focus:ring-2 focus:ring-brandGreen">
                Add to Cart
            </button>
        </div>
    );
}
