import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axiosInstance";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";
import posAnimation from "../../assets/animations/pos-machine.json";

export default function POSLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/auth/login", { username, password });
            const { token, user } = response.data;

            if (!token || !user) return toast.error("Invalid credentials");

            const roleMap = { 0: "superadmin", 1: "admin", 2: "cashier" };
            const role = roleMap[user.user_type] || null;
            if (!role) return toast.error("Unknown role");
            if (role !== "cashier") return toast.error("This page is for cashiers only.");

            localStorage.setItem("token", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", role);

            setIsLoggedIn(true);
            navigate("/dashboard");
        } catch (error) {
            toast.error("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-white p-6">
            {/* Animation + Card Container */}
            <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl">

                {/* Lottie Animation */}
                <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                    <Lottie animationData={posAnimation} loop className="w-full h-full" />
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
                        Welcome!
                    </h2>
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        Sign in to your account
                    </p>

                    {/* Form */}
                    <div className="flex flex-col gap-4">
                        {/* Username */}
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder=" "
                                className="peer w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-800 
                  focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                            <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-400">
                                Username
                            </label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaUser />
                            </span>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                className="peer w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 text-gray-800 
                  focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                            <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-400">
                                Password
                            </label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaLock />
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white
                hover:bg-green-600 transition shadow active:scale-95"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer bottom-left */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Zero One
            </div>
        </div>
    );
}
