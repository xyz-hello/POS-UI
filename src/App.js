import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Initialize login state from localStorage once
  const [, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      const status = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(status);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected routes with role-based access */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Toast notifications container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
