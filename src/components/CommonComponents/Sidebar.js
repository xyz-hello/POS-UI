import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = menuByRole[role] || [];
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      {/* Mobile hamburger toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-indigo-700 text-white shadow-md">
        <div className="font-bold text-xl">{roleTitle} Panel</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-indigo-900 text-indigo-100 shadow-xl
          md:static md:translate-x-0 transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          md:w-64
          z-40
          flex flex-col
        `}
      >
        {/* Logo / Title */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-indigo-800 font-extrabold text-2xl tracking-wide">
          {roleTitle} Panel
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-md transition 
                hover:bg-indigo-700 hover:text-white
                ${isActive ? 'bg-indigo-700 shadow-lg font-semibold text-white' : 'text-indigo-300'}
                `
              }
              onClick={() => setIsOpen(false)} // Close menu on mobile when clicked
            >
              <Icon className="h-6 w-6" />
              <span className="text-md">{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Optional footer or user info */}
        <div className="border-t border-indigo-800 p-4 text-indigo-400 text-sm">
          &copy; 2025 Zero One
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
