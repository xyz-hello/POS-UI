import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from '../../services/axiosInstance';

export default function POSLogin({ setIsLoggedIn }) {
    const [username, setUsername] = useState(""); //backend
    const [password, setPassword] = useState(""); //backemnd
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/auth/login", { username, password });
            const { token, user } = response.data;

            if (!token || !user) {
                toast.error("Invalid credentials");
                return;
            }

            // Save token and user info
            localStorage.setItem("token", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(user));

            // Map user_type to role
            let role = '';
            if (user.user_type === 0) role = 'superadmin';
            else if (user.user_type === 1) role = 'admin';
            else if (user.user_type === 2) role = 'cashier';
            else {
                toast.error("Unknown role");
                return;
            }
            localStorage.setItem("role", role);

            setIsLoggedIn(true);

            // Redirect based on role
            if (role === 'cashier') navigate("/dashboard"); // POSDashboard
            else if (role === 'admin') navigate("/admin/dashboard"); //DA
            else if (role === 'superadmin') navigate("/superadmin/dashboard"); //SA 

        } catch (error) {
            toast.error("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">POS Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
