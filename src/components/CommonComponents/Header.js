import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false); // Toggle profile dropdown
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Toggle logout modal
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Map numeric user_type to role label
  const roleLabels = {
    0: 'Super Admin',
    1: 'Admin',
    2: 'Cashier',
  };

  // Determine displayed role
  const fullName = roleLabels[user?.user_type] || 'Unknown Role';

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="text-xl font-semibold text-gray-800">Dashboard</div>

        {/* Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName
              )}&background=081A4B&color=FFFFFF&bold=true`}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />

            {/* Role Name */}
            <span className="text-sm font-medium text-gray-800">
              {fullName}
            </span>

            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
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
      </header>

      {/* Logout Confirmation */}
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
    </>
  );
}
