import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

export default function Header({ allowedRoles = [] }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Map numeric user_type to role label
  const roleLabels = { 0: 'Super Admin', 1: 'Admin', 2: 'Cashier' };
  const displayName = user?.username || 'Unknown User';
  const roleLabel = roleLabels[user?.user_type] || 'Unknown Role';

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');

    // Redirect based on role
    if (user?.user_type === 0) navigate('/superadmin/login');
    else if (user?.user_type === 1) navigate('/admin/login');
    else navigate('/login');
  }, [navigate, user]);

  // Redirect if user not logged in or role not allowed
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (allowedRoles.length && !allowedRoles.includes(user.user_type)) {
      alert('You are not authorized to access this page.');
      handleLogout();
    }
  }, [user, allowedRoles, navigate, handleLogout]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="text-xl font-semibold text-gray-800">Dashboard</div>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&background=081A4B&color=FFFFFF&bold=true`}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-800">
                {displayName} ({roleLabel})
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

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
        )}
      </header>

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
