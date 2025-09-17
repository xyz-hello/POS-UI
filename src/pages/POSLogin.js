import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/axiosInstance";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Lottie from "lottie-react";
import posAnimation from "../pos/assets/animations/pos-machine.json";

export default function POSLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [animate, setAnimate] = useState(false); // trigger entrance animation
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            toast.error("Please enter username and password");
            return;
        }

        try {
            const response = await api.post("/auth/login", { username, password });
            const { user, token } = response.data;

            const allowedRoles = [2, 3]; // cashier & manager
            if (!allowedRoles.includes(Number(user.user_type))) {
                toast.error("This login page is only for Cashiers and Managers.");
                localStorage.clear();
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", String(user.user_type));
            localStorage.setItem("user", JSON.stringify(user));
            if (user.customer_id) localStorage.setItem("customer_id", user.customer_id);

            setIsLoggedIn(true);
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    // trigger entrance animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="relative min-h-screen flex flex-col justify-center items-center bg-neutralLight p-6"
            onKeyDown={handleKeyPress}
        >
            <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-5xl">
                {/* Lottie animation with entrance animation */}
                <div
                    className={`w-64 h-64 md:w-80 md:h-80 flex-shrink-0
                        transition-opacity transition-transform duration-1000 ease-out
                        ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                >
                    <Lottie
                        animationData={posAnimation}
                        loop
                        className="w-full h-full"
                    />
                </div>

                {/* Login form with entrance animation */}
                <div
                    className={`bg-neutralCard rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6
                        transition-opacity transition-transform duration-1000 ease-out
                        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <h2 className="text-2xl font-bold text-neutralDark text-center md:text-left">
                        Welcome!
                    </h2>
                    <p className="text-sm text-neutralGray text-center md:text-left">
                        Sign in to your account
                    </p>

                    <div className="flex flex-col gap-4">
                        {/* Username */}
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="peer w-full pl-10 pr-4 py-3 rounded-lg border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen transition"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralGray">
                                <FaUser />
                            </span>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="peer w-full pl-10 pr-10 py-3 rounded-lg border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen transition"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralGray">
                                <FaLock />
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutralGray hover:text-neutralDark transition"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Sign In */}
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 rounded-lg font-semibold bg-brandGreen text-white hover:bg-brandGreenDark transition shadow active:scale-95"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-neutralGray">
                &copy; {new Date().getFullYear()} Zero One
            </div>
        </div>
    );
}
