import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/superadmin/dashboard"
          element={isLoggedIn ? <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/dashboard"
          element={isLoggedIn ? <AdminDashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
      </Routes>

      {/* Toast notification container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
