import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';
import POSLogin from './pages/POS/Login';
import POSDashboard from './clients/POS/pages/Dashboard';
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
      {/* Global Toast container for all routes */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* Public login routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<POSLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin/login" element={<Login role="admin" setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/superadmin/login" element={<Login role="superadmin" setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['cashier']}>
              <POSDashboard setIsLoggedIn={setIsLoggedIn} />
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
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
