import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png'; //Imported logo image

//Heroicons for sidebar navigation
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// 🔐 Define role-based navigation menus
const menuByRole = {
  superadmin: [
    { name: 'Dashboard', to: '/superadmin/dashboard', icon: HomeIcon },
    { name: 'Users', to: '/superadmin/users', icon: UsersIcon },
    { name: 'Reports', to: '/superadmin/reports', icon: ChartBarIcon },
    { name: 'Settings', to: '/superadmin/settings', icon: Cog6ToothIcon },
  ],
  admin: [
    { name: 'Dashboard', to: '/admin/dashboard', icon: HomeIcon },
    { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
  ],
};

export default function Sidebar({ role = 'superadmin' }) {
  const [isOpen, setIsOpen] = useState(false); //Mobile sidebar open/close state

  const menuItems = menuByRole[role] || []; //Get sidebar menu based on role

  return (
    <>
      {/* Mobile header with logo and toggle button */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white text-gray-800 shadow">
        <img src={logo} alt="App Logo" className="h-8" /> {/* Logo for mobile header */}
        <button
          onClick={() => setIsOpen(!isOpen)} //Toggle sidebar on mobile
          className="focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7" /> //Close icon
          ) : (
            <Bars3Icon className="h-7 w-7" /> //Hamburger icon
          )}
        </button>
      </div>

      {/*Main sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white text-gray-700 shadow-md
          md:static md:translate-x-0 transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          md:w-64
          z-40
          flex flex-col
        `}
      >
        {/* Sidebar header with logo (desktop only) */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-200">
          <img src={logo} alt="App Logo" className="h-30" />
        </div>

        {/* Sidebar navigation links */}
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              onClick={() => setIsOpen(false)} //Close sidebar on link click (for mobile)
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-[#081A4B] text-white shadow-sm font-medium' // Active state
                  : 'text-[#081A4B] hover:bg-[#f5f3ff] hover:text-[#061533]' // Inactive state
                }`
              }

            >
              <Icon className="h-5 w-5" /> {/* Menu icon */}
              <span className="text-sm">{name}</span> {/* Menu label */}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer (copyright) */}
        <div className="border-t border-gray-200 p-4 text-[#0f1e40] text-xs text-center">
          &copy; 2025 Zero One
        </div>
      </aside >

      {/* Mobile overlay when sidebar is open */}
      {
        isOpen && (
          <div
            onClick={() => setIsOpen(false)} //Clicking outside closes sidebar
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            aria-hidden="true"
          />
        )
      }
    </>
  );
}
