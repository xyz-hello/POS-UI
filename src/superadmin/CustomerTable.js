import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCustomerModal from '../components/CommonComponents/AddCustomerModal';
import { MdEdit, MdDelete, MdToggleOn, MdToggleOff } from 'react-icons/md';
import DeleteModal from '../components/CommonComponents/ConfirmationModal';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 State to store search input

  const baseURL = 'http://localhost:4000/api/superadmin';

  // Fetch all customers from backend
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

  // Soft delete customer by updating status to 'DELETED'
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${baseURL}/customers/${selectedUserId}/status`,
        { status: 'DELETED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedUserId ? { ...c, status: 'DELETED' } : c
        )
      );
      setIsDeleteModalOpen(false);
      showSuccessToast('Customer marked as DELETED.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showErrorToast('Failed to delete customer.');
    }
  };

  // Toggle customer status (ACTIVE ↔ INACTIVE)
  const handleToggleStatus = async () => {
    try {
      const newStatus =
        selectedCustomer.status.toUpperCase() === 'ACTIVE'
          ? 'INACTIVE'
          : 'ACTIVE';

      const token = localStorage.getItem('token');
      await axios.put(
        `${baseURL}/customers/${selectedCustomer.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedCustomer.id ? { ...c, status: newStatus } : c
        )
      );

      setIsToggleModalOpen(false);
      showSuccessToast(`Customer status set to ${newStatus}.`);
    } catch (error) {
      console.error('Error toggling status:', error);
      showErrorToast('Failed to update status.');
    }
  };

  // Handle edit button
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Handle add button
  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setShowModal(false);
  };

  // Refresh customer list after add/edit
  const handleUserAddedOrUpdated = () => {
    fetchCustomers();
    handleCloseModal();
  };

  // Filter customers based on searchTerm
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic based on filtered list
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto min-h-screen bg-[#F3F4F6]">
      {/* Search and Add Button (top row) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
        />

        {/* Add Customer Button */}
        <button
          onClick={handleAdd}
          className="bg-[#081A4B] hover:bg-[#061533] text-white px-6 py-2 rounded-md font-medium shadow-md transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Customers List Title (below search + add) */}
      <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Customers List</h2>



      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-5 text-left">#</th>
              <th className="px-6 py-5 text-left">Name</th>
              <th className="px-6 py-5 text-left">System Type</th>
              <th className="px-6 py-5 text-left">Status</th>
              <th className="px-6 py-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer, index) => (
              <tr
                key={customer.id}
                className={`border-t border-gray-100 transition ${customer.status === 'DELETED'
                  ? 'bg-gray-100 text-gray-400'
                  : 'hover:bg-gray-50'
                  }`}
              >

                <td className="px-6 py-4">{indexOfFirst + index + 1}</td>
                <td className="px-6 py-4 font-semibold text-[#111827]">
                  {customer.name}
                </td>
                <td className="px-6 py-4">{customer.system_type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-600'
                      : customer.status === 'INACTIVE'
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Edit - only show if not deleted */}
                    {customer.status !== 'DELETED' && (
                      <button
                        onClick={() => handleEdit(customer)}
                        className="cursor-pointer text-white bg-[#081A4B] p-1 rounded-md hover:bg-[#061533]"
                      >
                        <MdEdit size={14} />
                      </button>
                    )}

                    {/* Toggle - only show if not deleted */}
                    {customer.status !== 'DELETED' && (
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsToggleModalOpen(true);
                        }}
                        title="Toggle Status"
                        className="transition"
                      >
                        {customer.status === 'ACTIVE' ? (
                          <MdToggleOn size={30} className="text-green-500" />
                        ) : (
                          <MdToggleOff size={30} className="text-gray-400" />
                        )}
                      </button>
                    )}

                    {/* Delete - only show if not deleted */}
                    {customer.status !== 'DELETED' && (
                      <button
                        onClick={() => {
                          setSelectedUserId(customer.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
            {currentCustomers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-10">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-1">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === 1
            ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
            : 'bg-[#081A4B] hover:bg-[#061533] text-white'
            }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === i + 1
              ? 'bg-[#081A4B] text-white border-[#081A4B]'
              : 'bg-white text-[#081A4B] border border-[#081A4B] hover:bg-[#f3f4f6]'
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages
            ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
            : 'bg-[#081A4B] hover:bg-[#061533] text-white'
            }`}
        >
          Next
        </button>
      </div>

      {showModal && (
        <AddCustomerModal
          editData={selectedCustomer}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}


      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customers.find(c => c.id === selectedUserId)?.name}"?`}
        confirmText="Yes"
        cancelText="No"
        type="delete"
      />

      {/* Status Toggle Modal */}
      <DeleteModal
        isOpen={isToggleModalOpen}
        onClose={() => setIsToggleModalOpen(false)}
        onConfirm={handleToggleStatus}
        title="Change Status"
        message={`Are you sure you want to set this customer to ${selectedCustomer?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
          }?`}
        confirmText="Yes"
        cancelText="No"
        type="delete"
      />
    </div>
  );
};

export default CustomerList;
