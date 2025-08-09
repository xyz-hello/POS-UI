import React, { useState, useEffect, useCallback } from 'react';
import { fetchUsers, deleteUser } from '../services/usersApi';
import DeleteModal from '../components/CommonComponents/ConfirmationModal';
import AddUserModal from '../components/CommonComponents/AddUserModal';
import { MdEdit, MdDelete } from 'react-icons/md';
import { showSuccessToast, showErrorToast } from '../utils/toast';

// Centralized roles list (should match AddUserModal's ROLES)
const ROLES = ['Admin', 'SuperAdmin'];

const UserList = () => {
    // State for user data and UI controls
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For edit modal data
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Track loading state for API calls

    const usersPerPage = 5;

    // Fetch user data from API - wrapped with useCallback to avoid unnecessary recreation
    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchUsers();
            setUsers(res.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load users once component mounts
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Handle user deletion (soft-delete)
    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedUserId);

            // Update local state to mark user as deleted without refetching
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === selectedUserId ? { ...user, status: 'DELETED' } : user
                )
            );

            setShowDeleteModal(false);
            showSuccessToast('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            showErrorToast('Failed to delete user.');
        }
    };

    // Open Add User modal (clear edit data)
    const handleAddUser = () => {
        setSelectedUser(null);
        setShowAddEditModal(true);
    };

    // Open Edit User modal with normalized role
    const handleEditUser = (user) => {
        const normalizedRole = user.role?.trim();
        const userWithNormalizedRole = {
            ...user,
            role: ROLES.includes(normalizedRole) ? normalizedRole : '',
        };
        setSelectedUser(userWithNormalizedRole);
        setShowAddEditModal(true);
    };

    // Close Add/Edit modal without reload
    const handleCloseModal = () => {
        setSelectedUser(null);
        setShowAddEditModal(false);
    };

    // Reload users after add or edit and close modal
    const handleUserAddedOrUpdated = () => {
        loadUsers();
        handleCloseModal();
    };

    // Show confirmation modal before delete
    const handleShowDeleteModal = (id) => {
        setSelectedUserId(id);
        setShowDeleteModal(true);
    };

    // Filter users based on search input (case insensitive)
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset current page if filtering results fewer pages
    useEffect(() => {
        if (currentPage > Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(1);
        }
    }, [filteredUsers, currentPage]);

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.max(Math.ceil(filteredUsers.length / usersPerPage), 1);

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="px-6 py-10 max-w-7xl mx-auto min-h-screen bg-[#F3F4F6]">
            {/* Search bar and Add User button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    disabled={loading} // Disable while loading to prevent race
                    className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                />
                <button
                    onClick={handleAddUser}
                    disabled={loading} // Disable button during loading
                    className="bg-[#081A4B] hover:bg-[#061533] text-white px-6 py-2 rounded-md font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add User
                </button>
            </div>

            {/* Users list title */}
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Users List</h2>

            {/* Users table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-xs tracking-wide">
                        <tr>
                            <th className="px-6 py-5 text-left">#</th>
                            <th className="px-6 py-5 text-left">Username</th>
                            <th className="px-6 py-5 text-left">Email</th>
                            <th className="px-6 py-5 text-left">Role</th>
                            <th className="px-6 py-5 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-400 py-10">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`border-t border-gray-100 transition ${user.status === 'DELETED' ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <td className="px-6 py-4">{indexOfFirstUser + index + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-[#111827]">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.status !== 'DELETED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="cursor-pointer text-white bg-[#081A4B] p-1 rounded-md hover:bg-[#061533]"
                                                        title="Edit User"
                                                    >
                                                        <MdEdit size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleShowDeleteModal(user.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete User"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
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

            {/* Add/Edit User Modal */}
            {showAddEditModal && (
                <AddUserModal
                    editData={selectedUser}
                    onClose={handleCloseModal}
                    onUserAddedOrUpdated={handleUserAddedOrUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${users.find((u) => u.id === selectedUserId)?.username || 'this user'
                    }"?`}
                confirmText="Yes"
                cancelText="No"
                type="delete"
            />
        </div>
    );
};

export default UserList;
