import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/CommonComponents/Sidebar';
import Header from '../components/CommonComponents/Header';
import CustomerTable from './CustomerTable';
import AddUserModal from '../components/CommonComponents/AddUserModal'; //import modal
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast'; //reusable toast

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // trigger table refresh
  const [refreshFlag, setRefreshFlag] = useState(false);

  // store customer data for editing
  const [editData, setEditData] = useState(null);

  // logout and reset session
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  // when edit button is clicked (set selected customer)
  const handleEdit = (customer) => {
    setEditData(customer);
    // triggers edit modal
  };

  // delete customer from DB
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/customers/${id}`);
      setRefreshFlag(!refreshFlag); // trigger re-fetch after delete
      showSuccessToast('Customer deleted successfully'); // toast on success
    } catch (error) {
      console.error('Delete failed:', error);
      showErrorToast('Delete failed. Check backend logs.'); // toast on error
    }
  };

  // close modal and clear state
  const handleCloseModal = () => {
    setEditData(null); // clear editData to hide modal
  };

  // when user is added or edited
  const handleUserAddedOrUpdated = () => {
    setRefreshFlag(!refreshFlag); // trigger refresh
    setEditData(null); // close modal after save
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="superadmin" /> {/* superadmin sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} /> {/* header with logout */}

        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            {/* removed text heading */}
          </div>

          {/* customer table with refresh, edit, delete handlers */}
          <CustomerTable
            refreshTrigger={refreshFlag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* render AddUserModal only if editData is set */}
      {editData && (
        <AddUserModal
          editData={editData}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}
    </div>
  );
}
