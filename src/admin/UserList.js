// src/admin/UserList.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import DeleteModal from "../components/CommonComponents/ConfirmationModal";
import AddUserModal from "../components/CommonComponents/AddUserModal";
import IconButton from "../components/CommonComponents/IconButton";
import Pagination from "../components/CommonComponents/Pagination";
import { MdEdit, MdDelete, MdToggleOn, MdToggleOff } from "react-icons/md";
import { CiGrid41 } from "react-icons/ci";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { tableCell, tableHeader, tableRow } from "../utils/tableStyle";

const ROLES_TO_EXCLUDE = ["Admin", "SuperAdmin"];

const UserList = ({ refreshTrigger, onRefresh }) => {
    // ===================
    // State
    // ===================
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("table");
    const [modalState, setModalState] = useState({
        type: null,
        user: null,
        open: false,
    });

    const usersPerPage = 5;

    // ===================
    // Current logged-in user
    // ===================
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    }, []);

    const baseURL = "http://localhost:4000/api/admin/users";

    // ===================
    // Load users
    // ===================
    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(baseURL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            showErrorToast("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers, refreshTrigger]);

    // ===================
    // Filter & paginate
    // ===================
    const filteredUsers = users.filter((user) => {
        const matchesCustomer = user.customer_id === currentUser.customer_id;
        const roleExcluded = ROLES_TO_EXCLUDE.includes(user.role);
        const matchesSearch = user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
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
    // Modal handlers
    // ===================
    const closeModal = () =>
        setModalState({ type: null, user: null, open: false });
    const handleAddUser = () =>
        setModalState({ type: "add", user: null, open: true });
    const handleEditUser = (user) =>
        setModalState({ type: "edit", user, open: true });

    const handleUserAddedOrUpdated = () => {
        loadUsers();
        closeModal();
        if (onRefresh) onRefresh();
    };

    const handleConfirmDelete = async () => {
        if (!modalState.user) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${baseURL}/${modalState.user.id}/status`,
                { status: "DELETED" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === modalState.user.id ? { ...u, status: "DELETED" } : u
                )
            );
            closeModal();
            showSuccessToast("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            showErrorToast("Failed to delete user.");
        }
    };

    const handleToggleUserStatus = async () => {
        if (!modalState.user) return;
        try {
            const newStatus =
                modalState.user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            const token = localStorage.getItem("token");
            await axios.put(
                `${baseURL}/${modalState.user.id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === modalState.user.id ? { ...u, status: newStatus } : u
                )
            );
            closeModal();
            showSuccessToast(`User status set to ${newStatus}.`);
        } catch (error) {
            console.error("Error toggling status:", error);
            showErrorToast("Failed to update user status.");
        }
    };

    // ===================
    // JSX
    // ===================
    return (
        <div className="flex flex-col gap-6">
            {/* Search & Add */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => {
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

            {/* Header + View Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1F2937]">Users list</h2>
                <button
                    onClick={() =>
                        setViewMode(viewMode === "table" ? "gallery" : "table")
                    }
                    className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
                    title="Toggle View"
                >
                    <CiGrid41 size={18} className="text-[#081A4B]" />
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
                <table className="w-full text-sm text-gray-800 border-collapse">
                    <thead className="bg-[#081A4B] text-white">
                        <tr>
                            <th className={tableHeader}>#</th>
                            <th className={tableHeader}>Username</th>
                            <th className={tableHeader}>Email</th>
                            <th className={tableHeader}>Role</th>
                            <th className={tableHeader}>Status</th>
                            <th className={`${tableHeader} text-center`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className={`${tableCell} text-center text-gray-400 py-10`}
                                >
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`${tableRow} ${user.status === "DELETED"
                                        ? "bg-gray-100 text-gray-400"
                                        : ""
                                        }`}
                                >
                                    <td className={tableCell}>{indexOfFirstUser + index + 1}</td>
                                    <td className={`${tableCell} font-semibold text-[#111827]`}>
                                        {user.username}
                                    </td>
                                    <td className={tableCell}>{user.email}</td>
                                    <td className={tableCell}>{user.role}</td>
                                    <td className={tableCell}>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.status === "ACTIVE"
                                                ? "bg-green-100 text-green-600"
                                                : user.status === "INACTIVE"
                                                    ? "bg-gray-200 text-gray-400"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            {user.status !== "DELETED" && (
                                                <>
                                                    <IconButton
                                                        icon={MdEdit}
                                                        title="Edit"
                                                        onClick={() => handleEditUser(user)}
                                                        variant="edit"
                                                    />
                                                    <IconButton
                                                        icon={user.status === "ACTIVE" ? MdToggleOn : MdToggleOff}
                                                        title="Toggle Status"
                                                        onClick={() =>
                                                            setModalState({ type: "toggle", user, open: true })
                                                        }
                                                        variant={user.status === "ACTIVE" ? "toggle-on" : "toggle-off"}
                                                    />
                                                    <IconButton
                                                        icon={MdDelete}
                                                        title="Delete"
                                                        onClick={() =>
                                                            setModalState({ type: "delete", user, open: true })
                                                        }
                                                        variant="delete"
                                                    />
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
            <div className="flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Modals */}
            {modalState.open && (modalState.type === "add" || modalState.type === "edit") && (
                <AddUserModal
                    editData={modalState.type === "edit" ? modalState.user : null}
                    onClose={closeModal}
                    onUserAddedOrUpdated={handleUserAddedOrUpdated}
                />
            )}
            {modalState.open && modalState.type === "delete" && (
                <DeleteModal
                    isOpen
                    onClose={closeModal}
                    onConfirm={handleConfirmDelete}
                    title="Delete User"
                    message={`Are you sure you want to delete "${modalState.user?.username}"?`}
                    confirmText="Yes"
                    cancelText="No"
                    type="delete"
                />
            )}
            {modalState.open && modalState.type === "toggle" && (
                <DeleteModal
                    isOpen
                    onClose={closeModal}
                    onConfirm={handleToggleUserStatus}
                    title="Change User Status"
                    message={`Are you sure you want to set this user to ${modalState.user?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                        }?`}
                    confirmText="Yes"
                    cancelText="No"
                    type="delete"
                />
            )}
        </div>
    );
};

export default UserList;
