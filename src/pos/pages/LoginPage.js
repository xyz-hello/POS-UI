import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axiosInstance";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";
import posAnimation from "../assets/animations/pos-machine.json";

export default function POSLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        // console.log("Login button clicked");
        // console.log("Username:", username);
        // console.log("Password:", password);

        if (!username || !password) {
            toast.error("Please enter username and password");
            return;
        }

        try {
            console.log("Sending API request...");
            const response = await api.post("/auth/login", { username, password });
            console.log("API response:", response.data);

            const { user } = response.data;
            const role = user.role?.toLowerCase() || "cashier"; // fallback if undefined

            // Store login info in localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", role);
            localStorage.setItem("user_type", user.user_type);

            setIsLoggedIn(true);

            console.log("Stored role in localStorage:", localStorage.getItem("role"));

            // Navigate based on role
            if (role === "superadmin") navigate("/superadmin/dashboard");
            else if (role === "admin") navigate("/admin/dashboard");
            else navigate("/dashboard"); // cashier/baker
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Optional: submit on Enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div
            className="relative min-h-screen flex flex-col justify-center items-center bg-white p-6"
            onKeyDown={handleKeyPress}
        >
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
                            <label
                                className={`absolute left-10 text-gray-400 text-sm transition-all
                ${username ? "-top-2 text-sm text-green-400" : "top-1/2 text-base"} 
                -translate-y-1/2 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-400`}
                            >
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
                            <label
                                className={`absolute left-10 text-gray-400 text-sm transition-all
                ${password ? "-top-2 text-sm text-green-400" : "top-1/2 text-base"} 
                -translate-y-1/2 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-green-400`}
                            >
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

            {/* Footer */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Zero One
            </div>
        </div>
    );
}
