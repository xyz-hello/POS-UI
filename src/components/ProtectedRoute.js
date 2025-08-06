import React from 'react';
import { Navigate } from 'react-router-dom';

// Reusable protected route component
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;