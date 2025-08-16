import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DeleteModal from '../components/CommonComponents/ConfirmationModal';
import AddUserModal from '../components/CommonComponents/AddUserModal';
import { MdEdit, MdDelete, MdToggleOn, MdToggleOff } from 'react-icons/md';
import { showSuccessToast, showErrorToast } from '../utils/toast';

// Roles that should be excluded from the list
const ROLES_TO_EXCLUDE = ['Admin', 'SuperAdmin'];

const UserList = () => {
    // ===================
    // States
    // ===================
    const [users, setUsers] = useState([]); // all users
    const [selectedUserId, setSelectedUserId] = useState(null); // for delete
    const [selectedUser, setSelectedUser] = useState(null); // for edit
    const [selectedToggleUser, setSelectedToggleUser] = useState(null); // for status toggle
    const [showDeleteModal, setShowDeleteModal] = useState(false); // delete modal
    const [showAddEditModal, setShowAddEditModal] = useState(false); // add/edit modal
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false); // toggle status modal
    const [searchTerm, setSearchTerm] = useState(''); // search input
    const [currentPage, setCurrentPage] = useState(1); // pagination
    const [loading, setLoading] = useState(false); // loading state

    const usersPerPage = 5; // number of users per page

    // Current logged-in user from localStorage
    const currentUser = React.useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch {
            return {};
        }
    }, []);

    const baseURL = 'http://localhost:4000/api/admin/users';

    // ===================
    // Fetch users from backend
    // ===================
    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(baseURL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // ===================
    // Filter and paginate users
    // ===================
    const filteredUsers = users.filter(user => {
        const matchesCustomer = user.customer_id === currentUser.customer_id;
        const roleExcluded = ROLES_TO_EXCLUDE.includes(user.role);
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCustomer && !roleExcluded && matchesSearch;
    });

    const totalPages = Math.max(Math.ceil(filteredUsers.length / usersPerPage), 1);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [filteredUsers, currentPage, totalPages]);

    // ===================
    // Delete user (soft delete)
    // ===================
    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${baseURL}/${selectedUserId}/status`,
                { status: 'DELETED' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(prev =>
                prev.map(u => (u.id === selectedUserId ? { ...u, status: 'DELETED' } : u))
            );
            setShowDeleteModal(false);
            showSuccessToast('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            showErrorToast('Failed to delete user.');
        }
    };

    // ===================
    // Toggle user status ACTIVE ↔ INACTIVE
    // ===================
    const handleToggleUserStatus = async () => {
        try {
            const newStatus = selectedToggleUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            const token = localStorage.getItem('token');

            await axios.put(
                `${baseURL}/${selectedToggleUser.id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(prev =>
                prev.map(u =>
                    u.id === selectedToggleUser.id ? { ...u, status: newStatus } : u
                )
            );
            setIsToggleModalOpen(false);
            showSuccessToast(`User status set to ${newStatus}.`);
        } catch (error) {
            console.error('Error toggling user status:', error);
            showErrorToast('Failed to update user status.');
        }
    };

    // ===================
    // Handle add/edit
    // ===================
    const handleAddUser = () => {
        setSelectedUser(null);
        setShowAddEditModal(true);
    };

    const handleEditUser = (user) => {
        const normalizedRole = user.role?.trim();
        const userWithNormalizedRole = {
            ...user,
            role: ROLES_TO_EXCLUDE.includes(normalizedRole) ? '' : normalizedRole,
        };
        setSelectedUser(userWithNormalizedRole);
        setShowAddEditModal(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setShowAddEditModal(false);
    };

    const handleUserAddedOrUpdated = () => {
        loadUsers();
        handleCloseModal();
    };

    // ===================
    // Pagination controls
    // ===================
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    // ===================
    // JSX Return
    // ===================
    return (
        <div className="px-6 py-10 max-w-7xl mx-auto min-h-screen bg-[#F3F4F6]">
            {/* Search & Add User */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    disabled={loading}
                    className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B] focus:border-[#081A4B]"
                />
                <button
                    onClick={handleAddUser}
                    disabled={loading}
                    className="bg-[#081A4B] hover:bg-[#061533] text-white px-6 py-2 rounded-md font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Add User
                </button>
            </div>

            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Users List</h2>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-xs tracking-wide">
                        <tr>
                            <th className="px-6 py-5 text-left">#</th>
                            <th className="px-6 py-5 text-left">Username</th>
                            <th className="px-6 py-5 text-left">Email</th>
                            <th className="px-6 py-5 text-left">Role</th>
                            <th className="px-6 py-5 text-left">Status</th>
                            <th className="px-6 py-5 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 py-10">
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

                                    {/* Status Badge */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-600'
                                                : user.status === 'INACTIVE'
                                                    ? 'bg-gray-200 text-gray-400'
                                                    : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.status !== 'DELETED' && (
                                                <>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="cursor-pointer text-white bg-[#081A4B] p-1 rounded-md hover:bg-[#061533]"
                                                        title="Edit User"
                                                    >
                                                        <MdEdit size={14} />
                                                    </button>

                                                    {/* Toggle Status */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedToggleUser(user);
                                                            setIsToggleModalOpen(true);
                                                        }}
                                                        title="Toggle Status"
                                                        className="transition"
                                                    >
                                                        {user.status === 'ACTIVE' ? (
                                                            <MdToggleOn size={30} className="text-green-500" />
                                                        ) : (
                                                            <MdToggleOff size={30} className="text-gray-400" />
                                                        )}
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => setSelectedUserId(user.id) || setShowDeleteModal(true)}
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
                message={`Are you sure you want to delete "${users.find(u => u.id === selectedUserId)?.username || 'this user'
                    }"?`}
                confirmText="Yes"
                cancelText="No"
                type="delete"
            />

            {/* Status Toggle Confirmation Modal */}
            <DeleteModal
                isOpen={isToggleModalOpen}
                onClose={() => setIsToggleModalOpen(false)}
                onConfirm={handleToggleUserStatus}
                title="Change User Status"
                message={`Are you sure you want to set this user to ${selectedToggleUser?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                    }?`}
                confirmText="Yes"
                cancelText="No"
                type="delete"
            />
        </div>
    );
};

export default UserList;
