import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast, showWarnToast } from '../../utils/toast';

// Centralized list of valid roles
const ROLES = ['Admin', 'SuperAdmin'];

const AddUserModal = ({ editData, onClose, onUserAddedOrUpdated }) => {
    // Form fields state
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setUsername(editData.username || '');
            const normalizedRole = editData.role?.trim();

            // Normalize role ignoring case
            const matchedRole = ROLES.find(
                (r) => r.toLowerCase() === normalizedRole?.toLowerCase()
            ) || '';

            setRole(matchedRole);

            setPassword('');
            setRetypePassword('');
        } else {
            setUsername('');
            setRole('');
            setPassword('');
            setRetypePassword('');
        }
    }, [editData]);


    // Validate and submit form data
    const handleSubmit = async () => {
        if (!username || !role || (!editData && !password) || (password !== retypePassword)) {
            if (!username || !role) {
                showWarnToast('Please fill out all required fields.');
            } else if (!editData && !password) {
                showWarnToast('Please enter a password.');
            } else if (password !== retypePassword) {
                showWarnToast('Passwords do not match.');
            }
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const method = editData ? 'put' : 'post';
        const url = editData
            ? `http://localhost:4000/api/admin/users/${editData.id}`
            : `http://localhost:4000/api/admin/users`;

        try {
            await axios({
                method,
                url,
                data: {
                    username,
                    role,
                    ...(password ? { password } : {}), // Only send password if provided
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            showSuccessToast(editData ? 'User updated successfully!' : 'User added successfully!');
            onUserAddedOrUpdated();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            showErrorToast('Something went wrong while saving the user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
                <h2 className="text-xl font-semibold text-[#0f1e40] mb-6">
                    {editData ? 'Edit User' : 'Add User'}
                </h2>

                {/* Username input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        placeholder="Enter username"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Role dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        disabled={isSubmitting}
                    >
                        <option value="">Select Role</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Password input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editData ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        placeholder={editData ? 'Enter new password' : 'Enter password'}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Retype password input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retype Password</label>
                    <input
                        type="password"
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        className="w-full px-4 py-2 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        placeholder="Retype password"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4 mt-2">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-[100px] h-[38px] border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md text-sm font-medium focus:ring-2 focus:ring-[#0f1e40] focus:outline-none transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-[100px] h-[38px] rounded-md text-sm font-medium text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#081A4B] hover:bg-[#061533]'
                            }`}
                    >
                        {editData ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
