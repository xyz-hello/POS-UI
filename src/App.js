import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';

function App() {
  // Login state initialized from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Keep syncing localStorage changes to state (in case user refreshes)
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginStatus);
    };

    checkLoginStatus();

    // Optional: Listen for localStorage changes (multi-tab support)
    window.addEventListener('storage', checkLoginStatus);

    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* SuperAdmin Dashboard route (protected) */}
        <Route
          path="/superadmin/dashboard"
          element={
            isLoggedIn ? (
              <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin Dashboard route (protected) */}
        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn ? (
              <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      {/* ✅ Toast notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
