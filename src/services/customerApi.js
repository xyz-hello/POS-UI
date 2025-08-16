// src/services/customerApi.js
// Centralized API calls for managing customers

import axiosInstance from "./axiosInstance"; // pre-configured axios instance

// Get all customers (supports pagination + search)
export const fetchCustomers = (page = 1, search = "") =>
    axiosInstance.get(`/superadmin/customers`, {
        params: { page, search },
    });

// Update status (ACTIVE / INACTIVE / DELETED)
export const updateCustomerStatus = (id, status) =>
    axiosInstance.put(`/superadmin/customers/${id}/status`, { status });

// Create customer
export const createCustomer = (data) =>
    axiosInstance.post(`/superadmin/customers`, data);

// Edit customer
export const editCustomer = (id, data) =>
    axiosInstance.put(`/superadmin/customers/${id}`, data);

// Soft-delete customer (sets status = DELETED)
export const deleteCustomer = (id) =>
    axiosInstance.put(`/superadmin/customers/${id}/status`, { status: "DELETED" });
