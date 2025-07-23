import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserModal from '../components/CommonComponents/AddUserModal';
import { MdEdit, MdDelete } from 'react-icons/md';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const baseURL = 'http://localhost:4000/api/superadmin';

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseURL}/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refetch and reset page if needed
      const updatedCustomers = customers.filter((cust) => cust.id !== id);
      const newTotalPages = Math.ceil(updatedCustomers.length / customersPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(1); // Reset if current page is now invalid
      }
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setShowModal(false);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customer List</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Customer
        </button>
      </div>

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
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
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

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? 'bg-green-700 text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddUserModal
          editData={selectedCustomer}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}
    </div>
  );
};

export default CustomerList;
