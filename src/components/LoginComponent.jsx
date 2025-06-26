import React, { useState } from "react";
import { Eye, EyeOff, User, Lock, Loader2, Shield } from "lucide-react";

const LoginComponent = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://insurance-nodejs-server.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.token);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && username && password) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 opacity-60"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Corporate Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Policy Portal</h1>
          <p className="text-gray-600">Access your business dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-600">Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Username Field */}
            <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <User className="w-5 h-5" />
                Username
              </span>
            </label>

              <div className="relative">
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'username' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 ${
                    focusedField === 'username' 
                      ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${
                    loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                  <Lock className="w-5 h-5" />
                Password
                </span>
              </label>
              <div className="relative">
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                }`}>

                </div>
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 ${
                    focusedField === 'password' 
                      ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${
                    loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-blue-600"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || !username || !password}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                loading || !username || !password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Forgot password?
              </button>
              <span className="text-gray-500">Need help?</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Millennium Insurance Brokers. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center text-xs text-gray-400">
            <Shield className="w-3 h-3 mr-1" />
            Secured with enterprise-grade encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;