import React from "react";
import { Search, Home, Users, Briefcase, MessageCircle, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="text-[#0a66c2]" size={28} />
            <span className="text-lg font-semibold text-gray-800 hidden sm:inline">NetConnect</span>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
            />
          </div>
        </div>

        {/* Center (minimal icons for nav feel) */}
        <div className="hidden lg:flex items-center gap-6">
          <Home className="text-gray-600 hover:text-[#0a66c2] cursor-pointer" />
          <Users className="text-gray-600 hover:text-[#0a66c2] cursor-pointer" />
          <MessageCircle className="text-gray-600 hover:text-[#0a66c2] cursor-pointer" />
          <Bell className="text-gray-600 hover:text-[#0a66c2] cursor-pointer" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0a66c2] rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">{user?.name}</span>
          </div>

          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-600 p-2 rounded transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

