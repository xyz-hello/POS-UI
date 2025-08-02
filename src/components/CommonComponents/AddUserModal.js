import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  showSuccessToast,
  showErrorToast,
  showWarnToast
} from '../../utils/toast';

const AddUserModal = ({ editData, onClose, onUserAddedOrUpdated }) => {
  const [name, setName] = useState('');
  const [systemType, setSystemType] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onUserAddedOrUpdated();
    } catch (error) {
      console.error('Error saving customer:', error);
      showErrorToast('Something went wrong while saving the customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">

        {/* Modal title */}
        <h2 className="text-xl font-semibold text-[#0f1e40] mb-6">
          {editData ? 'Edit Customer' : 'Add Customer'}
        </h2>

        {/* Customer name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
            placeholder="Enter customer name"
          />
        </div>

        {/* System Type dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">System Type</label>
          <select
            value={systemType}
            onChange={(e) => setSystemType(e.target.value)}
            className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
          >
            <option value="">Select system type</option>
            <option value="Banking">Banking</option>
            <option value="Retail">Retail</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Point of Sales">Point of Sales</option>
          </select>
        </div>

        {/* Status dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>



        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={onClose}
            className="w-[100px] h-[38px] border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md text-sm font-medium focus:ring-2 focus:ring-[#0f1e40] focus:outline-none transition duration-150"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`w-[100px] h-[38px] rounded-md text-sm font-medium text-white transition ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#081A4B] hover:bg-[#061533]'
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
