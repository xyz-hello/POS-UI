import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function POSDashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar active="Dashboard" /> {/* active prop highlights current menu */}

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Content would go here */}
                <div className="flex-1 mt-20 p-5">
                    {/* mt-20 ensures content starts below fixed header */}
                </div>
            </div>
        </div>
    );
}
