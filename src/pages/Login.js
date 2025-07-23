import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        // Save token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', user.user_type === 0 ? 'superadmin' : 'admin');

        setIsLoggedIn(true);

        // Redirect based on role
        if (user.user_type === 0) {
          navigate('/superadmin/dashboard');
        } else if (user.user_type === 1) {
          navigate('/admin/dashboard');
        } else {
          setError('Unknown role');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Invalid Credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 bg-indigo-700 text-indigo-100 flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
        <p className="text-lg max-w-md text-center">
          Insightful analytics and effortless client management at your fingertips.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center bg-white p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Login to your account</h2>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
          >
            Log In
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
