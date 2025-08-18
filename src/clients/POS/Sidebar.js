import React from 'react';
import { FaSearch, FaUserCircle, FaHome, FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa';

export default function Sidebar({ active }) {
    const menuItems = [
        { name: 'Dashboard', icon: FaHome },
        { name: 'Orders', icon: FaShoppingCart },
        { name: 'Customers', icon: FaUsers },
        { name: 'Settings', icon: FaCog },
    ];

    return (
        <div className="w-64 bg-[#081A4B] text-white h-screen flex flex-col p-6">
            <h2 className="text-2xl font-bold mb-8">Tasty Station</h2>

            <div className="flex items-center gap-2 mb-6">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-[#162450] text-white px-4 py-2 rounded-lg w-full"
                />
            </div>

            <nav className="flex-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.name}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#162450] ${active === item.name ? 'bg-[#162450]' : ''
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto flex items-center gap-3">
                <FaUserCircle className="w-8 h-8" />
                <span>Cashier</span>
            </div>
        </div>
    );
}
