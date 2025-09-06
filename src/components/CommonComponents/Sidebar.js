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
  DocumentTextIcon
} from "@heroicons/react/24/outline";

// -------------------- Role-based Menu Definition --------------------
const menuByRole = {
  superadmin: [
    { name: "Dashboard", to: "/superadmin/dashboard", icon: HomeIcon }, // Dashboard only
    { name: "Settings", to: "/superadmin/settings", icon: Cog6ToothIcon }, // App settings
  ],
  admin: [
    { name: "Dashboard", to: "/admin/dashboard", icon: HomeIcon }, // Main dashboard
    { name: "Products", to: "/admin/products", icon: CubeIcon }, // Add/edit products
    { name: "Inventory", to: "/admin/inventory", icon: Squares2X2Icon }, // Adjust stock / inventory
    { name: "Analytics", to: "/admin/analytics", icon: PresentationChartBarIcon }, // Analytics tab
    { name: "Reports", to: "/admin/reports", icon: DocumentTextIcon }, // Reports tab
    { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon }, // App settings
  ],
};

// -------------------- Mobile Header Toggle --------------------
function MobileHeader({ isOpen, setIsOpen }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white text-gray-800 shadow">
      {/* Toggle button for sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
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
          onClick={closeSidebar} // Close sidebar on mobile after click
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

// -------------------- Sidebar Footer --------------------
function SidebarFooter() {
  return (
    <div className="border-t border-gray-200 p-4 text-[#0f1e40] text-xs text-center">
      &copy; 2025 Zero One
    </div>
  );
}

// -------------------- Main Sidebar Component --------------------
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Get user role from localStorage (default to 'admin')
  const role = localStorage.getItem("role") || "admin";
  const menuItems = menuByRole[role] || [];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile header toggle */}
      <MobileHeader isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white text-gray-700 shadow-md
          md:static md:translate-x-0 transform
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          md:w-64 z-40 flex flex-col
        `}
      >
        {/* Desktop logo / header */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-200">
          {/* Optional logo */}
          {/* <img src={logo} alt="App Logo" className="h-30" /> */}
        </div>

        {/* Sidebar navigation links */}
        <SidebarLinks menuItems={menuItems} closeSidebar={closeSidebar} />

        {/* Sidebar footer */}
        <SidebarFooter />
      </aside>

      {/* Mobile overlay */}
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
