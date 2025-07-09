// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';

function App() {
  // Initialize isLoggedIn from localStorage so it persists on refresh
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected superadmin dashboard */}
        <Route
          path="/superadmin/dashboard"
          element={isLoggedIn ? <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />

        {/* Protected admin dashboard */}
        <Route
          path="/admin/dashboard"
          element={isLoggedIn ? <AdminDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App; 
