import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function POSDashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Dashboard content */}
                <main className="p-6 flex-1 overflow-auto">
                    <div className="grid grid-cols-3 gap-6">
                        {/* Example cards */}
                        <div className="bg-white p-4 rounded-lg shadow">Card 1</div>
                        <div className="bg-white p-4 rounded-lg shadow">Card 2</div>
                        <div className="bg-white p-4 rounded-lg shadow">Card 3</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
