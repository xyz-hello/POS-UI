import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdToggleOn, MdToggleOff } from "react-icons/md";

// Modals
import AddCustomerModal from "../components/CommonComponents/AddCustomerModal";
import DeleteModal from "../components/CommonComponents/ConfirmationModal";

// Toast utils
import { showSuccessToast, showErrorToast } from "../utils/toast";

// API calls (services layer)
import { fetchCustomers, updateCustomerStatus } from "../services/customerApi";

const CustomerList = () => {
  // ================= STATE =================
  const [customers, setCustomers] = useState([]); // Customer list
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For edit/toggle
  const [selectedUserId, setSelectedUserId] = useState(null); // For delete

  // Modal state manager
  const [modal, setModal] = useState({
    addEdit: false,
    delete: false,
    toggle: false,
  });

  // Pagination + search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const customersPerPage = 5;

  // ================= API CALLS =================
  const loadCustomers = async () => {
    try {
      const response = await fetchCustomers(); // call API service
      setCustomers(response.data); // save into state
    } catch (error) {
      console.error("Error fetching customers:", error);
      showErrorToast("Failed to fetch customer list.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await updateCustomerStatus(selectedUserId, "DELETED");

      // Optimistically update UI without full reload
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedUserId ? { ...c, status: "DELETED" } : c
        )
      );

      setModal((prev) => ({ ...prev, delete: false }));
      showSuccessToast("Customer marked as DELETED.");
    } catch (error) {
      console.error("Error deleting customer:", error);
      showErrorToast("Failed to delete customer.");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus =
        selectedCustomer.status.toUpperCase() === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      await updateCustomerStatus(selectedCustomer.id, newStatus);

      // Update only that customer in state
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id ? { ...c, status: newStatus } : c
        )
      );

      setModal((prev) => ({ ...prev, toggle: false }));
      showSuccessToast(`Customer status set to ${newStatus}.`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showErrorToast("Failed to update status.");
    }
  };

  // ================= HANDLERS =================
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setModal((prev) => ({ ...prev, addEdit: true }));
  };

  const handleAdd = () => {
    setSelectedCustomer(null); // new customer
    setModal((prev) => ({ ...prev, addEdit: true }));
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setModal((prev) => ({ ...prev, addEdit: false }));
  };

  const handleUserAddedOrUpdated = () => {
    loadCustomers(); // reload after add/edit
    handleCloseModal();
  };

  // ================= FILTER & PAGINATION =================
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages =
    Math.ceil(filteredCustomers.length / customersPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // ================= LIFECYCLE =================
  useEffect(() => {
    loadCustomers();
  }, []);

  // ================= RENDER =================
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto min-h-screen bg-[#F3F4F6]">
      {/* Search + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to page 1 when searching
          }}
          className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
        />

        <button
          onClick={handleAdd}
          className="bg-[#081A4B] hover:bg-[#061533] text-white px-6 py-2 rounded-md font-medium shadow-md transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Title */}
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
                className={`border-t border-gray-100 transition ${customer.status === "DELETED"
                  ? "bg-gray-100 text-gray-400"
                  : "hover:bg-gray-50"
                  }`}
              >
                <td className="px-6 py-4">{indexOfFirst + index + 1}</td>
                <td className="px-6 py-4 font-semibold text-[#111827]">
                  {customer.name}
                </td>
                <td className="px-6 py-4">{customer.system_type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${customer.status === "ACTIVE"
                      ? "bg-green-100 text-green-600"
                      : customer.status === "INACTIVE"
                        ? "bg-gray-200 text-gray-400"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Edit */}
                    {customer.status !== "DELETED" && (
                      <button
                        onClick={() => handleEdit(customer)}
                        className="cursor-pointer text-white bg-[#081A4B] p-1 rounded-md hover:bg-[#061533]"
                      >
                        <MdEdit size={14} />
                      </button>
                    )}

                    {/* Toggle */}
                    {customer.status !== "DELETED" && (
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setModal((prev) => ({ ...prev, toggle: true }));
                        }}
                        title="Toggle Status"
                        className="transition"
                      >
                        {customer.status === "ACTIVE" ? (
                          <MdToggleOn size={30} className="text-green-500" />
                        ) : (
                          <MdToggleOff size={30} className="text-gray-400" />
                        )}
                      </button>
                    )}

                    {/* Delete */}
                    {customer.status !== "DELETED" && (
                      <button
                        onClick={() => {
                          setSelectedUserId(customer.id);
                          setModal((prev) => ({ ...prev, delete: true }));
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
            ? "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
            : "bg-[#081A4B] hover:bg-[#061533] text-white"
            }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === i + 1
              ? "bg-[#081A4B] text-white border-[#081A4B]"
              : "bg-white text-[#081A4B] border border-[#081A4B] hover:bg-[#f3f4f6]"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages
            ? "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
            : "bg-[#081A4B] hover:bg-[#061533] text-white"
            }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {modal.addEdit && (
        <AddCustomerModal
          editData={selectedCustomer}
          onClose={handleCloseModal}
          onUserAddedOrUpdated={handleUserAddedOrUpdated}
        />
      )}

      <DeleteModal
        isOpen={modal.delete}
        onClose={() => setModal((prev) => ({ ...prev, delete: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customers.find((c) => c.id === selectedUserId)?.name
          }"?`}
        confirmText="Yes"
        cancelText="No"
        type="delete"
      />

      <DeleteModal
        isOpen={modal.toggle}
        onClose={() => setModal((prev) => ({ ...prev, toggle: false }))}
        onConfirm={handleToggleStatus}
        title="Change Status"
        message={`Are you sure you want to set this customer to ${selectedCustomer?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
          }?`}
        confirmText="Yes"
        cancelText="No"
        type="delete"
      />
    </div>
  );
};

export default CustomerList;
