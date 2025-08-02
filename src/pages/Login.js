import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);

        if (user.user_type === 0) navigate('/superadmin/dashboard');
        else if (user.user_type === 1) navigate('/admin/dashboard');
        else if (user.user_type === 2) navigate('/cashier/dashboard');
        else setError('Unknown role');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-[#081A4B] flex-col justify-center items-center px-6">
        <div className="flex flex-col justify-center items-center h-full text-white p-10">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Unified Client Management
          </h2>
          <p className="text-md text-gray-200 text-center">
            Manage clients, users, and operations — all in one unified dashboard.
          </p>
        </div>
      </div >

      {/* Right panel: light gray background, center the card */}
      < div className="flex flex-col w-full md:w-1/2 bg-gray-50 justify-center items-center p-8" >
        {/* Card container wrapping all login content */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-48 h-auto max-h-40 mb-6 object-scale-down"
          />
          {/* texts */}
          <h1 className="text-3xl font-semibold text-[#081A4B] mb-6">Log into your Account</h1>

          {/* Single login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username input with icon */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="pl-10 pr-3 py-2.5 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B]"
              />
            </div>

            {/* Password input with icon and toggle */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#081A4B] text-white font-semibold py-2.5 rounded-md hover:bg-[#061533] transition"
            >
              Log In
            </button>

            {/* Error message */}
            {error && <p className="text-red-600 text-center mt-2 text-sm">{error}</p>}
          </form>

          {/* “Your Account” container below the form */}
          <div className="mt-8 p-6 border border-gray-200 rounded-md shadow-sm bg-[#f9fafb]">
            <h2 className="text-lg font-semibold text-[#081A4B] mb-2">Your Account</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Manage your settings and preferences. Contact your admin if you don’t have access.
            </p>
          </div>
        </div >
      </div >
    </div >
  );
}
