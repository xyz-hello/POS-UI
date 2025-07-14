import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/CommonComponents/Sidebar';
import Header from '../components/CommonComponents/Header';
import CustomerTable from './CustomerTable';
import AddUserModal from '../components/CommonComponents/AddUserModal';
import { PlusIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editData, setEditData] = useState(null); // for editing selected customer

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    setShowAddUserModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return; // ✅ fixed confirm

    try {
      await axios.delete(`http://localhost:3000/api/customers/${id}`);
      setRefreshFlag(!refreshFlag); // trigger refresh
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Check backend logs.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="superadmin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} />

        <main className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-700">Customer List</h2>
            <button
              onClick={() => {
                setEditData(null); // Add mode
                setShowAddUserModal(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              <PlusIcon className="h-5 w-5" />
              Add User
            </button>
          </div>

          <CustomerTable
            refreshTrigger={refreshFlag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {showAddUserModal && (
            <AddUserModal
              onClose={() => setShowAddUserModal(false)}
              onUserAdded={() => {
                setRefreshFlag(!refreshFlag);
              }}
              editData={editData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
