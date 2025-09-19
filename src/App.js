import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';
import InventoryPage from './admin/InventoryPage';
import POSLogin from './pages/POSLogin';
import POSDashboard from './pos/pages/Dashboard';
import ProtectedRoute from './components/settings/ProtectedRoute';
import { CartProvider } from './pos/components/contexts/cartContext';
import ProductList from './admin/ProductList';
import AdminCalendarPage from './admin/CalendarPage';
import UnderConstructionIcon from './components/CommonComponents/UnderConstructionIcon';

function App() {
  const [, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
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

        {/* Protected POS routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[2, 3]}>
            <CartProvider>
              <POSDashboard setIsLoggedIn={setIsLoggedIn} />
            </CartProvider>
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={[1]}>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute allowedRoles={[1]}>
            <InventoryPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <div className="flex justify-center items-center h-full">
                <UnderConstructionIcon size={150} />
              </div>
            </ProtectedRoute>
          } />
        <Route path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <div className="flex justify-center items-center h-full">
                <UnderConstructionIcon size={150} />
              </div>
            </ProtectedRoute>
          } />
        <Route path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <div className="flex justify-center items-center h-full">
                <UnderConstructionIcon size={150} />
              </div>
            </ProtectedRoute>
          } />
        <Route path="/admin/calendar" element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminCalendarPage />
          </ProtectedRoute>
        } />

        {/* Superadmin routes */}
        <Route path="/superadmin/dashboard" element={
          <ProtectedRoute allowedRoles={[0]}>
            <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/settings" element={
          <ProtectedRoute allowedRoles={[0]}>
            <div className="flex justify-center items-center h-full">
              <UnderConstructionIcon size={150} />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
