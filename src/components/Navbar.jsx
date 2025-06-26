import React from "react";
import { LogOut, Shield } from "lucide-react";

const Navbar = ({ onLogout }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token"); 
      onLogout();
      alert("Logged out successfully!");
    }
  };


  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-sm border-b border-slate-600/30 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300 ease-out">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent tracking-tight">
                Insurance App
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-blue-400 to-transparent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
          </div>

          {/* Enhanced Logout Button */}
          <button
            onClick={handleLogout}
            className="group relative overflow-hidden bg-white/10 hover:bg-red-500/90 text-white border border-white/20 hover:border-red-400 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-out hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center space-x-2 relative z-10">
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              <span>Logout</span>
            </span>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;