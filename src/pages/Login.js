import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loginAnimation from "../assets/animations/Login.json";
import axiosInstance from "../services/axiosInstance";
import Footer from "../components/CommonComponents/Footer";

export default function LoginPage({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false); // control page entrance animation

  const navigate = useNavigate();
  const location = useLocation();

  // Detect login type based on URL path
  let role = "pos"; // default POS login
  if (location.pathname.includes("/superadmin")) role = "superadmin";
  else if (location.pathname.includes("/admin")) role = "admin";

  const loginRoleText =
    role === "superadmin"
      ? "Super Admin Login"
      : role === "admin"
        ? "Admin Login"
        : "POS Login";

  const roleMap = { superadmin: 0, admin: 1, manager: 2, cashier: 3 };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      const { token, user } = response.data;

      // Check if user can access this login page
      if (
        (role === "superadmin" && user.user_type !== roleMap.superadmin) ||
        (role === "admin" && user.user_type !== roleMap.admin) ||
        (role === "pos" && ![roleMap.manager, roleMap.cashier].includes(user.user_type))
      ) {
        toast.error("You do not have access to this page");
        return;
      }

      // Persist authentication info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", String(user.user_type));
      if (user.customer_id) localStorage.setItem("customer_id", user.customer_id);

      setIsLoggedIn(true);

      // Redirect by role
      if (user.user_type === roleMap.superadmin) navigate("/superadmin/dashboard");
      else if (user.user_type === roleMap.admin) navigate("/admin/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  // Trigger entrance animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left animation panel */}
      <div
        className={`hidden md:flex w-1/2 bg-primaryNavy justify-center items-center px-6 
          transition-all duration-1000 ease-out transform ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
      >
        <Lottie
          animationData={loginAnimation}
          loop
          className="w-5/6 max-w-xl h-auto"
          style={{
            maxHeight: "80vh",
            minHeight: "400px",
          }}
        />
      </div>

      {/* Right login form */}
      <div
        className={`flex flex-col w-full md:w-1/2 bg-gray-50 justify-center items-center p-8
          transition-all duration-1000 ease-out transform ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
          {/* Centered login role text */}
          <div className="w-full flex justify-center mb-6">
            <h1 className="text-3xl font-semibold text-[#081A4B]">{loginRoleText}</h1>
          </div>

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
                type={showPassword ? "text" : "password"}
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

      <Footer
        className="absolute bottom-4 left-4 text-xs text-neutralGray"
        company="Zero One"
        noBorder
        noPadding
      />
    </div>
  );
}
