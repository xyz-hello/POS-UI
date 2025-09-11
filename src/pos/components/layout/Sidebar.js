// src/pos/layout/Sidebar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/CommonComponents/Footer";
import { primaryMenu, secondaryMenu } from "../layout/SidebarMenu";

export default function Sidebar({ collapsed, setCollapsed, isMobile }) {
    const [active, setActive] = useState("Sales"); // Default active tab
    const navigate = useNavigate();

    // Render menu item button
    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const isActive = active === item.name;

        const handleClick = () => {
            setActive(item.name); // set active tab
            navigate(`/pos/${item.name.toLowerCase()}`); // navigate
        };

        return (
            <button
                key={item.name}
                onClick={handleClick}
                className={`w-full flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors
                    ${isActive
                        ? "bg-brandGreen text-white"
                        : "hover:bg-neutralHover text-neutralDark"
                    }`}
            >
                <Icon
                    size={20}
                    className={isActive ? "text-white" : "text-neutralGray"}
                />
                {!collapsed && (
                    <span className="font-medium text-base ml-3">{item.name}</span>
                )}
            </button>
        );
    };

    return (
        <div
            className={`h-screen flex flex-col justify-between transition-all duration-300 overflow-auto
                ${collapsed ? "w-16" : "w-64"} bg-neutralCard shadow-sm
                ${isMobile ? "fixed top-0 left-0 z-50" : "relative"}`}
            style={{ paddingTop: "6rem" }} // offset for fixed header
        >
            {/* Mobile toggle button */}
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

            {/* Primary cashier menu */}
            <nav className="flex-1 flex flex-col gap-3 px-2 sm:px-4 pt-4 sm:pt-0">
                {primaryMenu.map(renderMenuItem)}
            </nav>

            {/* Divider */}
            {!collapsed && (
                <div className="border-t border-neutralBorder mx-4 my-2"></div>
            )}

            {/* Secondary utilities (without logout now) */}
            <div className="px-2 sm:px-4 flex flex-col gap-2">
                {secondaryMenu
                    .filter((item) => item.name !== "Logout") // remove Logout
                    .map(renderMenuItem)}
            </div>

            {/* Footer (reused) */}
            {!collapsed && <Footer />}
        </div>
    );
}
