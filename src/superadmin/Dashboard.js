import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/CommonComponents/Sidebar";
import Header from "../components/CommonComponents/Header";
import CustomerTable from "./CustomerTable";
import AddCustomerModal from "../components/CommonComponents/AddCustomerModal";
import { deleteCustomer } from "../services/customerApi"; //API 
import { showSuccessToast, showErrorToast } from "../utils/toast";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // trigger table refresh
  const [refreshFlag, setRefreshFlag] = useState(false);

  // modal state (open/close + customer data)
  const [modal, setModal] = useState({ isOpen: false, customer: null });

  // logout and reset session
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); // no reload needed
  };

  // when edit button is clicked (set selected customer)
  const handleEdit = (customer) => {
    setModal({ isOpen: true, customer });
  };

  // delete customer from DB
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await deleteCustomer(id);
      setRefreshFlag((prev) => !prev); // trigger re-fetch after delete
      showSuccessToast("Customer deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      showErrorToast("Delete failed. Check backend logs.");
    }
  };

  // close modal
  const handleCloseModal = () => {
    setModal({ isOpen: false, customer: null });
  };

  // when user is added or edited
  const handleUserAddedOrUpdated = () => {
    setRefreshFlag((prev) => !prev);
    setModal({ isOpen: false, customer: null });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="superadmin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />

        <main className="p-6 overflow-auto">
          <CustomerTable
            refreshTrigger={refreshFlag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* Add/Edit Modal */}
      {modal.isOpen && (
        <AddCustomerModal
          editData={modal.customer}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}
    </div>
  );
}
