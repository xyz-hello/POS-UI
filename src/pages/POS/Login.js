import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axiosInstance";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";

export default function POSLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/auth/login", { username, password });
            const { token, user } = response.data;

            if (!token || !user) {
                toast.error("Invalid credentials");
                return;
            }

            let role = "";
            if (user.user_type === 0) role = "superadmin";
            else if (user.user_type === 1) role = "admin";
            else if (user.user_type === 2) role = "cashier";
            else {
                toast.error("Unknown role");
                return;
            }

            if (role !== "cashier") {
                toast.error("This page is for cashiers only.");
                return;
            }

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
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#e0f2f1] via-[#c8f0e6] to-[#f1f5f9]">
            <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
                {/* Logo */}
                {/* <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" />
        </div> */}

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter your username and password to log in to your account
                </p>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    {/* Username / Email */}
                    <div className="relative">
                        <label className="text-gray-600 text-sm mb-1 block">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <UserIcon className="h-5 w-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-okGreen transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="text-gray-600 text-sm mb-1 block">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-okGreen transition pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 rounded-lg font-semibold bg-okGreen text-white transition hover:opacity-90"
                    >
                        Log in
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Zero One
                </div>
            </div>
        </div>
    );
}
