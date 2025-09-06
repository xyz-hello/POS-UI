import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/CommonComponents/Sidebar";
import Header from "../components/CommonComponents/Header";
import UserList from "./UserList";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Trigger reload for UserList
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 py-8">
          {/* User List */}
          <UserList
            refreshTrigger={refreshFlag}
            onRefresh={() => setRefreshFlag(prev => !prev)}
          />
        </main>
      </div>
    </div>
  );
}
