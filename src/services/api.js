import axios from 'axios';

const API_URL = 'http://localhost:4000/api/superadmin/customers';

const getToken = () => localStorage.getItem('token');

export const fetchCustomers = async () => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const deleteCustomer = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const updateCustomer = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
