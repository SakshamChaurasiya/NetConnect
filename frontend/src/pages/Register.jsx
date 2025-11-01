import React, { useState } from "react";
import { apiClient } from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

const Register = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/auth/register", { name, email, password });
      showToast("Account created successfully!");
      onSwitchToLogin();
    } catch {
      showToast("Registration failed", "error");
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Make the most of your professional life
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
          />
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0A66C2] text-white py-2 rounded-full hover:bg-[#004182] transition font-medium"
          >
            {loading ? "Creating..." : "Agree & Join"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-700 text-sm mt-6">
        Already on LinkedIn?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-[#0A66C2] font-medium hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;
