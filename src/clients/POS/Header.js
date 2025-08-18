import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center gap-4">
                <button className="relative">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
                </button>

                <div className="flex items-center gap-2 cursor-pointer">
                    <UserCircleIcon className="w-8 h-8 text-gray-600" />
                    <span className="text-gray-800 font-medium">Cashier</span>
                </div>
            </div>
        </header>
    );
}
