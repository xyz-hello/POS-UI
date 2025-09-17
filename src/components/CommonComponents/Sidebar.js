import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

import Footer from "../CommonComponents/Footer";

// -------------------- Role-based Menu Definition --------------------
const menuByRole = {
  0: [ // superadmin
    { name: "Dashboard", to: "/superadmin/dashboard", icon: HomeIcon },
    { name: "Settings", to: "/superadmin/settings", icon: Cog6ToothIcon },
  ],
  1: [ // admin
    { name: "Dashboard", to: "/admin/dashboard", icon: HomeIcon },
    { name: "Products", to: "/admin/products", icon: CubeIcon },
    { name: "Inventory", to: "/admin/inventory", icon: Squares2X2Icon },
    { name: "Analytics", to: "/admin/analytics", icon: PresentationChartBarIcon },
    { name: "Reports", to: "/admin/reports", icon: DocumentTextIcon },
    { name: "Calendar", to: "/admin/calendar", icon: CalendarIcon },
    { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
  ],
};

// -------------------- Mobile Header Toggle --------------------
function MobileHeader({ isOpen, setIsOpen }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white text-gray-800 shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>
    </div>
  );
}

// -------------------- Sidebar Navigation Links --------------------
function SidebarLinks({ menuItems, closeSidebar }) {
  return (
    <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
      {menuItems.map(({ name, to, icon: Icon }) => (
        <NavLink
          key={name}
          to={to}
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
              ? "bg-[#081A4B] text-white shadow-sm font-medium"
              : "text-[#081A4B] hover:bg-[#f5f3ff] hover:text-[#061533]"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span className="text-sm">{name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

// -------------------- Main Sidebar Component --------------------
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Get role as a number from localStorage
  const role = Number(localStorage.getItem("role"));
  const menuItems = menuByRole[role] || [];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <MobileHeader isOpen={isOpen} setIsOpen={setIsOpen} />

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white text-gray-700 shadow-md
          md:static md:translate-x-0 transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          md:w-64 z-40 flex flex-col
        `}
      >
        {/* Optional logo/header */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-200">
          {/* Logo can go here */}
        </div>

        {/* Navigation Links */}
        <SidebarLinks menuItems={menuItems} closeSidebar={closeSidebar} />

        {/* Footer pinned at the bottom */}
        <Footer company="Zero One" className="mt-auto" />
      </aside>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
