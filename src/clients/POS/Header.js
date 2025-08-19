import React from 'react';
import { BellIcon, MagnifyingGlassCircleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const displayName = user?.username || "User";

    return (
        <header className="w-full flex flex-wrap justify-between items-center p-4 sm:p-5 bg-white border-b border-gray-200 fixed top-0 left-0 z-50">

            {/* Search input - centered on all screen sizes */}
            <div className="flex-1 flex justify-center order-2 sm:order-1 mt-3 sm:mt-0 w-full sm:w-auto">
                <div className="w-full max-w-xl relative px-4 sm:px-0">
                    <MagnifyingGlassCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search menu, orders and more"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-okGreen"
                    />
                </div>
            </div>

            {/* Right section: notifications + avatar */}
            <div className="flex items-center gap-3 order-1 sm:order-2">
                {/* Notification bell */}
                <button className="relative p-2 rounded-full hover:bg-green-200/50 transition">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
                </button>

                {/* Person icon avatar + name */}
                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-green-200/50 transition">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-400">
                        <UserIcon className="w-5 h-5 text-gray-600 filter grayscale" />
                    </div>
                    <span className="text-gray-800 font-medium truncate max-w-[100px]">{displayName}</span>
                    {/* truncate + max-w ensures long usernames don’t break layout */}
                </div>
            </div>
        </header>
    );
}
