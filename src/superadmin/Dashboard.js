import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/CommonComponents/Sidebar';
import Header from '../components/CommonComponents/Header';
import CustomerTable from './CustomerTable';
import axios from 'axios';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editData, setEditData] = useState(null); // For editing selected customer

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    // You can open edit modal here if needed
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/customers/${id}`);
      setRefreshFlag(!refreshFlag); // Trigger refresh
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
          </div>

          <CustomerTable
            refreshTrigger={refreshFlag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}
