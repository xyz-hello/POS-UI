import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Home,
    ShoppingCart,
    Package,
    User,
    BarChart2,
    HelpCircle,
    LogOut,
    Settings,
} from "lucide-react";
import ConfirmationModal from "../modals/ConfirmationModal";

export default function Sidebar({ collapsed, setCollapsed, isMobile }) {
    const [active, setActive] = useState("Dashboard"); // Track active menu
    const [showLogoutModal, setShowLogoutModal] = useState(false); // For logout modal
    const navigate = useNavigate();

    // Bakery POS essentials
    const primaryMenu = [
        { name: "Dashboard", icon: Home },
        { name: "New Sale", icon: ShoppingCart },
        { name: "Products", icon: Package },
        { name: "Customers", icon: User },
        { name: "Reports", icon: BarChart2 },
    ];

    const secondaryMenu = [
        { name: "Help Center", icon: HelpCircle },
        { name: "Settings", icon: Settings },
        { name: "Logout", icon: LogOut },
    ];

    // Logout handler
    const handleLogout = useCallback(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        // Redirect based on role
        if (user?.user_type === 0) navigate("/superadmin/login");
        else if (user?.user_type === 1) navigate("/admin/login");
        else navigate("/login");
    }, [navigate]);

    // Render menu items
    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const isActive = active === item.name;

        const handleClick = () => {
            if (item.name === "Logout") {
                setShowLogoutModal(true);
            } else {
                setActive(item.name);
                // TODO: navigate(`/pos/${item.name.toLowerCase()}`);
            }
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
        <>
            <div
                className={`h-screen flex flex-col justify-between transition-all duration-300 overflow-auto
                    ${collapsed ? "w-16" : "w-64"} bg-neutralCard shadow-sm
                    ${isMobile ? "fixed top-0 left-0 z-50" : "relative"}`}
                style={{ paddingTop: "6rem" }} // offset for fixed header
            >
                {/* Mobile toggle */}
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

                {/* Primary menu */}
                <nav className="flex-1 flex flex-col gap-3 px-2 sm:px-4 pt-4 sm:pt-0">
                    {primaryMenu.map(renderMenuItem)}
                </nav>

                {/* Divider */}
                {!collapsed && (
                    <div className="border-t border-neutralBorder mx-4 my-2"></div>
                )}

                {/* Secondary menu */}
                <div className="px-2 sm:px-4 flex flex-col gap-2">
                    {secondaryMenu.map(renderMenuItem)}
                </div>

                {/* Footer / copyright */}
                {!collapsed && (
                    <div className="px-2 sm:px-4 pb-4 mt-4 text-center text-xs text-neutralGray">
                        © 2025 Zero One
                    </div>
                )}
            </div>

            {/* Logout modal */}
            {showLogoutModal && (
                <ConfirmationModal
                    title="Logout"
                    message="Are you sure you want to logout?"
                    onConfirm={() => {
                        setShowLogoutModal(false);
                        handleLogout();
                    }}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}
        </>
    );
}
