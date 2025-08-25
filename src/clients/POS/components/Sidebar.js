import React, { useState } from "react";
import { Home, Clipboard, Table, User, HelpCircle, LogOut, Settings } from "lucide-react";

const Sidebar = () => {
    const [active, setActive] = useState("Dashboard");
    const [collapsed, setCollapsed] = useState(false); // for responsive collapse

    const menuItems = [
        { name: "Dashboard", icon: Home },
        { name: "Order Line", icon: Clipboard },
        { name: "Manage Table", icon: Table },
        { name: "Customers", icon: User },
    ];

    const bottomItems = [
        { name: "Help Center", icon: HelpCircle },
        { name: "Settings", icon: Settings },
        { name: "Logout", icon: LogOut },
    ];

    // Render each menu item
    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const isActive = active === item.name;

        return (
            <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`w-full flex items-center px-7 py-3 rounded-lg transition-colors
                    ${isActive ? "bg-brandGreenLight/50" : "hover:bg-brandGreenLight/30"}`}
            >
                {/* Icon changes color when active */}
                <Icon size={20} className={`${isActive ? "text-brandGreen" : "text-neutralDark"}`} />

                {/* Show label if sidebar is not collapsed */}
                {!collapsed && (
                    <span
                        className="ml-3 text-neutralDark font-medium"
                        style={{ fontSize: "16px" }}
                    >
                        {item.name}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div
            className={`h-screen bg-white shadow-md flex flex-col justify-between text-neutralDark
                ${collapsed ? "w-16" : "w-64"} transition-all duration-300 overflow-auto`}
        >
            {/* Toggle button for mobile / collapse */}
            <div className="p-4 flex justify-end sm:hidden">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* Main menu */}
            <nav className="flex-1 flex flex-col gap-3 px-2 sm:px-4 pt-8 sm:pt-32">
                {menuItems.map(renderMenuItem)}
            </nav>

            {/* Bottom menu */}
            <div className="px-2 sm:px-4 pb-6 flex flex-col gap-2">
                {bottomItems.map(renderMenuItem)}
            </div>
        </div>
    );
};

export default Sidebar;
