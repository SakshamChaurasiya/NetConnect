import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.post("/auth/login", { email, password });
      login(data.token, data.user);
      showToast("Welcome back!");
    } catch {
      showToast("Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-1">
        <span className="text-2xl font-bold text-[#0A66C2]">Net</span>
        <span className="bg-[#0A66C2] text-white font-bold text-xl rounded-sm px-1.5">Connect</span>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
          />
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-[#0A66C2] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0A66C2] text-white py-2 rounded-full hover:bg-[#004182] transition font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-700 text-sm mt-6">
        New to LinkedIn?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-[#0A66C2] font-medium hover:underline"
        >
          Join now
        </button>
      </p>
    </div>
  );
};

export default Login;
