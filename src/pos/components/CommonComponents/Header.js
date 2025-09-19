// src/pos/layout/Header.js
import React, { useState, useCallback, useRef, useEffect } from "react";
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "../../../components/CommonComponents/ConfirmationModal";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const displayName = user?.username || "User";
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/login");
    }, [navigate]);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full flex justify-between items-center p-4 sm:p-5 bg-neutralCard border-b border-neutralBorder fixed top-0 left-0 z-50 h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl finger-paint-regular text-neutralDark">
                    Paypayan
                </h1>

            </div>


            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-brandGreenLight/30 transition"
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutralLight border-2 border-neutralBorder">
                        <UserIcon className="w-5 h-5 text-neutralGray" />
                    </div>
                    <span className="text-neutralDark font-medium truncate max-w-[100px]">
                        {displayName}
                    </span>
                </div>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                navigate("/pos/profile");
                            }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                setShowLogoutModal(true);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Reused Confirmation Modal */}
            {showLogoutModal && (
                <ConfirmationModal
                    isOpen={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                    title="Logout"
                    message="Are you sure you want to logout?"
                    confirmText="Yes"
                    cancelText="No"
                    type="delete"
                />
            )}
        </header>
    );
}
