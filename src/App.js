import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

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
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
