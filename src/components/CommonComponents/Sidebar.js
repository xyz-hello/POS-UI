import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// import logo from "../../assets/logo.png";
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,        // use this for Products
  Squares2X2Icon, // use this for Inventory
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Define menus for different roles
const menuByRole = {
  superadmin: [
    { name: "Dashboard", to: "/superadmin/dashboard", icon: HomeIcon },
    { name: "Users", to: "/superadmin/users", icon: UsersIcon },
    { name: "Reports", to: "/superadmin/reports", icon: ChartBarIcon },
    { name: "Settings", to: "/superadmin/settings", icon: Cog6ToothIcon },
  ],
  admin: [
    { name: "Dashboard", to: "/admin/dashboard", icon: HomeIcon },
    { name: "Products", to: "/admin/products", icon: CubeIcon },       // new tab
    { name: "Inventory", to: "/admin/inventory", icon: Squares2X2Icon }, // new tab
    { name: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
  ],
};

// Mobile toggle button
function MobileHeader({ isOpen, setIsOpen }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white text-gray-800 shadow">
      {/* <img src={logo} alt="App Logo" className="h-8" /> */}
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

// Sidebar links
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

// Sidebar footer
function SidebarFooter() {
  return (
    <div className="border-t border-gray-200 p-4 text-[#0f1e40] text-xs text-center">
      &copy; 2025 Zero One
    </div>
  );
}

// Main Sidebar component
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Read role from localStorage (fallback to "admin" if not found)
  const role = localStorage.getItem("role") || "admin";
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
        {/* Desktop logo */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-200">
          {/* <img src={logo} alt="App Logo" className="h-30" /> */}
        </div>

        {/* Navigation links */}
        <SidebarLinks menuItems={menuItems} closeSidebar={closeSidebar} />

        {/* Footer */}
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
