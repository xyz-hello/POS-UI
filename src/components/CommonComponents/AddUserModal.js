import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddUserModal({ onClose, onUserAdded, editData }) {
  const isEdit = !!editData;

  const [name, setName] = useState('');
  const [systemType, setSystemType] = useState('POS');
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);

  // Set form fields when in edit mode
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isEdit) {
      setName(editData.name || '');
      setSystemType(editData.system_type || 'POS');
      setStatus(editData.status || 'ACTIVE');
    }
  }, [editData]);

  // Handle form submit for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/customers/${editData.id}`, {
          name,
          system_type: systemType,
          status,
        });
      } else {
        await axios.post('http://localhost:3000/api/customers', {
          name,
          system_type: systemType,
          status,
        });
      }

      onUserAdded(); // Refresh parent table
      onClose();     // Close modal
    } catch (error) {
      console.error('User submit failed:', error);
      alert('Failed to submit. Check backend console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{isEdit ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* System Type Field */}
          <div>
            <label className="block text-sm font-medium">System Type</label>
            <input
              type="text"
              value={systemType}
              onChange={(e) => setSystemType(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              disabled={loading}
            >
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Adding...'
                : isEdit
                ? 'Update'
                : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
