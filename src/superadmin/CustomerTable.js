import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function CustomerTable({ refreshTrigger, onEdit, onDelete }) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:3000/api/customers')
      .then((res) => {
        setCustomers(res.data);
        setCurrentPage(1); // reset to page 1 when data updates
      })
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

  // Calculate indexes for pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-indigo-100">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">System Type</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(({ id, name, system_type, status }) => (
            <tr key={id} className="even:bg-gray-50 hover:bg-indigo-50">
              <td className="py-2 px-4 border">{id}</td>
              <td className="py-2 px-4 border">{name}</td>
              <td className="py-2 px-4 border">{system_type}</td>
              <td className="py-2 px-4 border">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {status}
                </span>
              </td>
              <td className="py-2 px-4 border text-center">
                <div className="flex justify-center space-x-2">
                  <PencilSquareIcon
                    className="h-5 w-5 text-blue-500 cursor-pointer"
                    onClick={() => onEdit({ id, name, system_type, status })}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => onDelete(id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p className="text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
