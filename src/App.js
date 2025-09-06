import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/LoginPage';
import SuperAdminDashboard from './superadmin/Dashboard';
import AdminDashboard from './admin/Dashboard';
import ProductsPage from './admin/ProductList';
import InventoryPage from './admin/InventoryPage';
// import AnalyticsPage from './admin/AnalyticsPage';
// import ReportsPage from './admin/ReportsPage';

import POSLogin from './pos/pages/LoginPage';
import POSDashboard from './pos/pages/DashboardPage';
import ProtectedRoute from './components/settings/ProtectedRoute';
import { CartProvider } from './pos/components/contexts/cartContext';

function App() {
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
      {/* Global Toast container */}
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['cashier', 'baker']}>
              <CartProvider>
                <POSDashboard setIsLoggedIn={setIsLoggedIn} />
              </CartProvider>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              {/* Replace with AdminSettingsPage if exists */}
              <div>Admin Settings Page</div>
            </ProtectedRoute>
          }
        />

        {/* Superadmin routes */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/settings"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              {/* Replace with SuperAdminSettingsPage if exists */}
              <div>Superadmin Settings Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
