import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserModal from '../components/CommonComponents/AddUserModal';
import { MdEdit, MdDelete } from 'react-icons/md';
import DeleteModal from '../components/CommonComponents/DeleteModal';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const CustomerList = () => {
  // State to store all customers
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For editing
  const [showModal, setShowModal] = useState(false); // Show/hide add/edit modal

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const baseURL = 'http://localhost:4000/api/superadmin';

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showErrorToast('Failed to fetch customer list.');
    }
  };

  // Handle delete from confirmation modal
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/customers/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedCustomers = customers.filter((cust) => cust.id !== selectedUserId);
      const newTotalPages = Math.ceil(updatedCustomers.length / customersPerPage);
      if (currentPage > newTotalPages) setCurrentPage(1);
      setCustomers(updatedCustomers);
      setIsDeleteModalOpen(false);
      showSuccessToast('Customer deleted successfully.'); // ✅ Toast on success
    } catch (error) {
      console.error('Error deleting customer:', error);
      showErrorToast('Failed to delete customer.'); // ✅ Toast on error
    }
  };

  // Open modal for editing
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Open modal for adding
  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setShowModal(false);
  };

  // After add/update, refresh and close modal
  const handleUserAddedOrUpdated = () => {
    fetchCustomers();
    handleCloseModal();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / customersPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customer List</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
        >
          + Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left text-black">#</th>
            <th className="py-2 px-4 text-left text-black">Name</th>
            <th className="py-2 px-4 text-left text-black">System Type</th>
            <th className="py-2 px-4 text-left text-black">Status</th>
            <th className="py-2 px-4 text-left text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer, index) => (
            <tr key={customer.id} className="border-b text-black">
              <td className="py-2 px-4">{indexOfFirst + index + 1}</td>
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.system_type}</td>
              <td className="py-2 px-4">{customer.status}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => {
                    setSelectedUserId(customer.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}

          {currentCustomers.length === 0 && (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border text-sm font-medium ${currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
            }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border text-sm font-medium ${currentPage === i + 1
              ? 'bg-indigo-700 text-white'
              : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100'
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border text-sm font-medium ${currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
            }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showModal && (
        <AddUserModal
          editData={selectedCustomer}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={customers.find(c => c.id === selectedUserId)?.name || ''}
      />
    </div>
  );
};

export default CustomerList;
