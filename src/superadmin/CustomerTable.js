import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerTable({ refreshTrigger }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/customers')
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-indigo-100">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">System Type</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(({ id, name, system_type, status }) => (
            <tr key={id} className="even:bg-gray-50 hover:bg-indigo-50">
              <td className="py-2 px-4 border">{id}</td>
              <td className="py-2 px-4 border">{name}</td>
              <td className="py-2 px-4 border">{system_type}</td>
              <td className="py-2 px-4 border">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-center mt-4 text-sm text-gray-600">
        Total Customers: {customers.length}
      </p>
    </div>
  );
}