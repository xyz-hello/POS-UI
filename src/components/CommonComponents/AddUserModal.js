import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  showSuccessToast,
  showErrorToast,
  showWarnToast
} from '../../utils/toast';

const AddUserModal = ({ editData, onClose, onUserAddedOrUpdated }) => {
  // 👉 Local form state
  const [name, setName] = useState('');
  const [systemType, setSystemType] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false); // 👉 Disable button while submitting

  // 👉 Pre-fill form when in edit mode, or reset for new user
  useEffect(() => {
    if (editData) {
      setName(editData.name ?? '');
      setSystemType(editData.system_type ?? '');
      setStatus(editData.status ?? 'ACTIVE');
    } else {
      setName('');
      setSystemType('');
      setStatus('ACTIVE');
    }
  }, [editData]);

  // 👉 Form submit: Add or Update customer
  const handleSubmit = async () => {
    if (!name || !systemType || !status) {
      showWarnToast('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    const method = editData ? 'put' : 'post';
    const url = editData
      ? `http://localhost:4000/api/superadmin/customers/${editData.id}`
      : `http://localhost:4000/api/superadmin/customers`;

    try {
      await axios({
        method,
        url,
        data: {
          name,
          system_type: systemType,
          status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast(editData ? 'Customer updated successfully!' : 'Customer added successfully!');
      onUserAddedOrUpdated(); // 👉 refresh list in parent
    } catch (error) {
      console.error('Error saving customer:', error);
      showErrorToast('Something went wrong while saving the customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 👉 Modal container
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editData ? 'Edit Customer' : 'Add Customer'}
        </h2>

        {/* 👉 Customer name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter customer name"
          />
        </div>

        {/* 👉 System Type dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">System Type</label>
          <select
            value={systemType}
            onChange={(e) => setSystemType(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="">Select system type</option>
            <option value="Banking">Banking</option>
            <option value="Retail">Retail</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Point of Sales">Point of Sales</option>
          </select>
        </div>

        {/* 👉 Status dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* 👉 Modal action buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`font-semibold py-2 px-4 rounded text-white ${isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-700 hover:bg-indigo-800'
              }`}
            disabled={isSubmitting}
          >
            {editData ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
