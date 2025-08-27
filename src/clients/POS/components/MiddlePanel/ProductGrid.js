import React from 'react';

export default function ProductGrid({ onSelect }) {
    // Sample products to display
    const products = [
        { id: 1, name: 'Ensaymada', price: 25, image: '/images/ensaymada.jpg' },
        { id: 2, name: 'Pandesal', price: 12, image: '/images/pandesal.jpg' },
        { id: 3, name: 'Cheese Roll', price: 18, image: '/images/cheese_roll.jpg' },
        { id: 4, name: 'Chocolate Cake', price: 200, image: '/images/chocolate_cake.jpg' },
        { id: 5, name: 'Blueberry Muffin', price: 35, image: '/images/blueberry_muffin.jpg' },
        { id: 6, name: 'Bun de Leche', price: 20, image: '/images/bun_de_leche.jpg' },
        { id: 7, name: 'Oatmeal Cookie', price: 15, image: '/images/oatmeal_cookie.jpg' },
        { id: 8, name: 'Banana Cake', price: 180, image: '/images/banana_cake.jpg' },
        { id: 9, name: 'Croissant', price: 30, image: '/images/croissant.jpg' },
        { id: 10, name: 'Loaf Bread', price: 50, image: '/images/loaf_bread.jpg' },
        { id: 11, name: 'Chocolate Chip Cookie', price: 18, image: '/images/choco_cookie.jpg' },
        { id: 12, name: 'Red Velvet Cake', price: 250, image: '/images/red_velvet.jpg' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {products.map((product) => (
                <button
                    key={product.id}
                    onClick={() => onSelect(product)}
                    className="flex flex-col items-center p-3 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                >
                    {/* Product image */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    {/* Product name */}
                    <div className="text-center text-sm font-medium text-gray-700 truncate w-full">
                        {product.name}
                    </div>
                    {/* Product price */}
                    <div className="text-center text-sm font-semibold text-brandGreen mt-1">
                        ₱{product.price}
                    </div>
                </button>
            ))}
        </div>
    );
}
