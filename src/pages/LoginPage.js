import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // added useLocation
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/animations/Login.json';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('cashier'); // default role
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  // Determine role based on URL path
  useEffect(() => {
    if (location.pathname.includes('/superadmin')) setRole('superadmin');
    else if (location.pathname.includes('/admin')) setRole('admin');
    else setRole('cashier'); // default
  }, [location.pathname]);

  // Heading text dynamically
  const loginRoleText =
    role === 'superadmin' ? 'Super Admin Login' :
      role === 'admin' ? 'Admin Login' :
        'Cashier Login';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { username, password });
      const { token, user } = response.data;

      const roleMap = { superadmin: 0, admin: 1, cashier: 2 };

      // Check if user role matches page role
      if (user.user_type !== roleMap[role]) {
        toast.error(`You do not have access to this page`);
        return;
      }

      // Save login info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', role);
      setIsLoggedIn(true);

      // Redirect based on role
      if (role === 'superadmin') navigate('/superadmin/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel: Lottie animation */}
      <div className="hidden md:flex w-1/2 bg-[#081A4B] justify-center items-center px-6">
        <div className="w-full h-full flex justify-center items-center">
          <Lottie
            animationData={loginAnimation}
            loop={true}
            className="w-full h-full max-w-lg max-h-[500px]"
          />
        </div>
      </div>

      {/* Right panel: login card */}
      <div className="flex flex-col w-full md:w-1/2 bg-gray-50 justify-center items-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-48 h-auto max-h-40 mb-6 object-scale-down" />
          <h1 className="text-3xl font-semibold text-[#081A4B] mb-6">{loginRoleText}</h1>
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="pl-10 pr-3 py-2.5 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#081A4B]"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
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

            <button
              type="submit"
              className="w-full bg-[#081A4B] text-white font-semibold py-2.5 rounded-md hover:bg-[#061533] transition"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 p-6 border border-gray-200 rounded-md shadow-sm bg-[#f9fafb] text-center">
            <p className="text-gray-700 text-sm leading-relaxed">
              Manage your settings and preferences. Contact your admin if you don’t have access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
