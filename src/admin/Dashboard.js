import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/CommonComponents/Sidebar";
import Header from "../components/CommonComponents/Header";
import UserList from "./UserList";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { deleteUser } from "../services/usersApi"; //API

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State to trigger reload of user list when toggled
  const [refreshFlag, setRefreshFlag] = useState(false);

  // TODO: Add state & modal for edit user modal visibility and data
  // const [editUser, setEditUser] = useState(null);
  // const [showEditModal, setShowEditModal] = useState(false);

  // Edit user handler - opens edit modal with user data
  const handleEdit = (user) => {
    console.log("Edit user:", user);
    // TODO: setEditUser(user);
    // TODO: setShowEditModal(true);
  };

  // Delete user handler
  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(userId); // call service function
      showSuccessToast("User deleted successfully");
      setRefreshFlag((prev) => !prev); // trigger refresh
    } catch (error) {
      console.error("Delete failed:", error);
      showErrorToast("Failed to delete user. Check backend logs.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />

        <main className="p-8 overflow-auto">
          {/* User List with refresh and event handlers */}
          <UserList
            refreshTrigger={refreshFlag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* TODO: Add EditUserModal component here with showEditModal & editUser state */}
        </main>
      </div>
    </div>
  );
}
