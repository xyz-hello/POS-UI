// AppLayout.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
    const [isMobile, setIsMobile] = useState(false); // Detect mobile screen
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track sidebar collapsed state

    // Layout constants
    const SIDEBAR_WIDTH = 16; // 16rem → w-64
    const SIDEBAR_COLLAPSED_WIDTH = 4; // 4rem → w-16
    const HEADER_HEIGHT = 4; // 4rem → h-16

    // Handle window resize for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640; // sm breakpoint
            setIsMobile(mobile);
            setSidebarCollapsed(mobile); // collapse sidebar on mobile
        };
        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex w-full h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                isMobile={isMobile}
            />

            {/* Main content wrapper */}
            <div
                className="flex-1 flex flex-col transition-all duration-300"
                style={{
                    // Shift content right to make space for sidebar on desktop
                    marginLeft: !isMobile
                        ? sidebarCollapsed
                            ? `${SIDEBAR_COLLAPSED_WIDTH}rem`
                            : `${SIDEBAR_WIDTH}rem`
                        : 0,
                }}
            >
                {/* Header (fixed at top) */}
                <Header />

                {/* Page content */}
                <main
                    className="flex-1 overflow-auto bg-gray-50"
                    style={{
                        paddingTop: `${HEADER_HEIGHT}rem`, // Add top padding so content is below header
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
