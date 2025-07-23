import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddUserModal = ({ editData, onClose, onUserAddedOrUpdated }) => {
  const [name, setName] = useState('');
  const [systemType, setSystemType] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setSystemType(editData.system_type || '');
      setStatus(editData.status || 'ACTIVE');
    } else {
      setName('');
      setSystemType('');
      setStatus('ACTIVE');
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!name || !systemType || !status) {
      alert('Please fill out all fields.');
      return;
    }

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

      toast.success(editData ? 'Customer updated successfully!' : 'Customer added successfully!');
      onUserAddedOrUpdated();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Something went wrong while saving the customer.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{editData ? 'Edit Customer' : 'Add Customer'}</h2>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">System Type</label>
          <input
            type="text"
            value={systemType}
            onChange={(e) => setSystemType(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter system type"
          />
        </div>
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
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            {editData ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
