import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();

    // Read from localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = (localStorage.getItem('role') || '').toLowerCase();

    // Normalize allowed roles
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

    if (!isLoggedIn) {
        // Not logged in → redirect to login
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles.length && !allowedRolesLower.includes(userRole)) {
        // Logged in but role not allowed
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
                <h1 className="text-3xl font-semibold mb-4 text-red-600">Access Denied</h1>
                <p className="mb-6">You are not authorized to access this page.</p>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/login';
                    }}
                    className="px-4 py-2 bg-[#081A4B] text-white rounded-md hover:bg-[#061533]"
                >
                    Logout & Login Again
                </button>
            </div>
        );
    }

    // Authorized → render children
    return children;
};

export default ProtectedRoute;
