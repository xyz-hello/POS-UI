import React from "react";
import { Home, Clipboard, Table, User, HelpCircle, LogOut, Settings } from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed, isMobile }) {
    const [active, setActive] = React.useState("Dashboard"); // Track active menu item

    // Top / Primary Menu
    const primaryMenu = [
        { name: "Dashboard", icon: Home },
        { name: "Order Line", icon: Clipboard },
        { name: "Manage Table", icon: Table },
        { name: "Customers", icon: User },
    ];

    // Bottom / Secondary Menu
    const secondaryMenu = [
        { name: "Help Center", icon: HelpCircle },
        { name: "Settings", icon: Settings },
        { name: "Logout", icon: LogOut },
    ];

    // Render a single menu item
    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const isActive = active === item.name;

        return (
            <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`w-full flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors
          ${isActive
                        ? "bg-brandGreen text-white"
                        : "hover:bg-neutralHover text-neutralDark"} // inactive item: neutral hover, dark text
        `}
            >
                <Icon
                    size={20}
                    className={`${isActive ? "text-white" : "text-neutralGray"}`}
                />
                {!collapsed && <span className="font-medium text-base ml-3">{item.name}</span>}
            </button>
        );
    };

    return (
        <div
            className={`h-screen flex flex-col justify-between transition-all duration-300 overflow-auto
        ${collapsed ? "w-16" : "w-64"} bg-neutralCard shadow-sm
        ${isMobile ? "fixed top-0 left-0 z-50" : "relative"}`}
            style={{ paddingTop: "6rem" }} // Offset for fixed header
        >
            {/* Toggle button for mobile */}
            {isMobile && (
                <div className="p-2 flex justify-end">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 bg-brandGreen rounded-full hover:bg-brandGreenLight/50 transition text-white"
                    >
                        {collapsed ? "→" : "←"}
                    </button>
                </div>
            )}

            {/* Top / Primary Menu */}
            <nav className="flex-1 flex flex-col gap-3 px-2 sm:px-4 pt-4 sm:pt-0">
                {primaryMenu.map(renderMenuItem)}
            </nav>

            {/* Divider / spacing */}
            {!collapsed && <div className="border-t border-neutralBorder mx-4 my-2"></div>}

            {/* Bottom / Secondary Menu */}
            <div className="px-2 sm:px-4 pb-4 flex flex-col gap-2">
                {secondaryMenu.map(renderMenuItem)}
            </div>
        </div>
    );
}