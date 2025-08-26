import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { showSuccessToast, showErrorToast, showWarnToast } from '../../utils/toast';

// Roles must match backend allowed roles (no Admin or SuperAdmin here)
const ROLES = ['Cashier', 'Baker'];

// Email and password validation regex helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,14}$/.test(password);

const AddUserModal = ({ editData, onClose, onUserAddedOrUpdated }) => {
    // Form states
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    // Refs for debounce timers
    const usernameTimeoutRef = useRef(null);
    const emailTimeoutRef = useRef(null);

    // Cleanup debounce timers on unmount
    useEffect(() => {
        return () => {
            if (usernameTimeoutRef.current) clearTimeout(usernameTimeoutRef.current);
            if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
        };
    }, []);

    // Initialize or reset form fields when editData changes
    useEffect(() => {
        if (editData) {
            setUsername(editData.username || '');
            setEmail(editData.email || '');
            // Normalize role case-insensitive
            const matchedRole =
                ROLES.find((r) => r.toLowerCase() === (editData.role || '').toLowerCase()) || '';
            setRole(matchedRole);
            setPassword('');
            setRetypePassword('');
            setUsernameError('');
            setEmailError('');
        } else {
            setUsername('');
            setEmail('');
            setRole('');
            setPassword('');
            setRetypePassword('');
            setUsernameError('');
            setEmailError('');
        }
    }, [editData]);

    // API check if username exists
    const checkUsernameExists = async (usernameToCheck) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(
                `http://localhost:4000/api/admin/users/check-username?username=${encodeURIComponent(
                    usernameToCheck
                )}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.exists;
        } catch (error) {
            console.error('Error checking username existence:', error);
            return false;
        }
    };

    // API check if email exists
    const checkEmailExists = async (emailToCheck) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(
                `http://localhost:4000/api/admin/users/check-email?email=${encodeURIComponent(emailToCheck)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email existence:', error);
            return false;
        }
    };

    // Debounced username change handler with trimming
    const handleUsernameChange = (value) => {
        const trimmed = value.trim();
        setUsername(trimmed);
        setUsernameError('');

        if (usernameTimeoutRef.current) clearTimeout(usernameTimeoutRef.current);

        if (!trimmed) {
            setUsernameError('Username is required.');
            return;
        }

        // Skip API call if editing and username unchanged
        if (editData && editData.username === trimmed) return;

        usernameTimeoutRef.current = setTimeout(async () => {
            const exists = await checkUsernameExists(trimmed);
            if (exists) setUsernameError('Username already exists.');
        }, 500);
    };

    // Debounced email change handler with trimming
    const handleEmailChange = (value) => {
        const trimmed = value.trim();
        setEmail(trimmed);
        setEmailError('');

        if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);

        if (!trimmed) {
            setEmailError('Email is required.');
            return;
        }
        if (!isValidEmail(trimmed)) {
            setEmailError('Invalid email address.');
            return;
        }

        // Skip API call if editing and email unchanged
        if (editData && editData.email === trimmed) return;

        emailTimeoutRef.current = setTimeout(async () => {
            const exists = await checkEmailExists(trimmed);
            if (exists) setEmailError('Email already exists.');
        }, 500);
    };

    // Validate password fields (for submit)
    const validatePasswordFields = () => {
        if (editData) {
            // On edit, password optional but if entered must be valid and match
            if (password) {
                if (!isValidPassword(password)) {
                    showWarnToast(
                        'Password must be 6-14 characters and include uppercase, lowercase, number, and symbol.'
                    );
                    return false;
                }
                if (password !== retypePassword) {
                    showWarnToast("Passwords don't match.");
                    return false;
                }
            }
        } else {
            // On add, password required and must be valid and match
            if (!password) {
                showWarnToast('Please enter a password.');
                return false;
            }
            if (!isValidPassword(password)) {
                showWarnToast(
                    'Password must be 6-14 characters and include uppercase, lowercase, number, and symbol.'
                );
                return false;
            }
            if (password !== retypePassword) {
                showWarnToast("Passwords don't match.");
                return false;
            }
        }
        return true;
    };

    // Submit handler
    const handleSubmit = async () => {
        if (!username || !email || !role) {
            showWarnToast('Please fill in all the required fields.');
            return;
        }

        if (usernameError || emailError) {
            showWarnToast('Please fix errors before submitting.');
            return;
        }

        if (!isValidEmail(email)) {
            showWarnToast('Invalid email address.');
            return;
        }

        if (!validatePasswordFields()) return;

        setIsSubmitting(true);

        try {
            // Check username uniqueness before submit if changed
            if (
                (!editData || (editData && username !== editData.username)) &&
                (await checkUsernameExists(username))
            ) {
                showWarnToast('Username already exists. Please choose another.');
                setIsSubmitting(false);
                return;
            }

            // Check email uniqueness before submit if changed
            if (
                (!editData || (editData && email !== editData.email)) &&
                (await checkEmailExists(email))
            ) {
                showWarnToast('Email already exists. Please choose another.');
                setIsSubmitting(false);
                return;
            }

            const token = localStorage.getItem('token');
            const method = editData ? 'put' : 'post';
            const url = editData
                ? `http://localhost:4000/api/admin/users/${editData.id}`
                : `http://localhost:4000/api/admin/users`;

            const payload = {
                username,
                email,
                role,
            };
            if (password) {
                payload.password = password;
            }

            await axios({
                method,
                url,
                data: payload,
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
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${usernameError ? 'border-red-500 focus:ring-red-500' : 'border-[#0f1e40] focus:ring-[#0f1e40]'
                            }`}
                        placeholder="Enter username"
                        disabled={isSubmitting}
                    />
                    {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>

                {/* Email input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-[#0f1e40] focus:ring-[#0f1e40]'
                            }`}
                        placeholder="Enter email address"
                        disabled={isSubmitting}
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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

                {/* Password input with toggle */}
                <div className="relative mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        placeholder={editData ? 'Leave blank to keep current password' : 'Enter password'}
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Retype password input with toggle */}
                <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retype Password</label>
                    <input
                        type={showRetypePassword ? 'text' : 'password'}
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                        placeholder={editData ? 'Leave blank to keep current password' : 'Retype password'}
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRetypePassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                        aria-label={showRetypePassword ? 'Hide password' : 'Show password'}
                    >
                        {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
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
                        disabled={isSubmitting || usernameError || emailError}
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
