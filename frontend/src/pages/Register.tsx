import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ApiError } from "../types/index";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role as "manager" | "admin");
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(
        (err as ApiError).response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {}
        <div className="glass-card rounded-3xl shadow-2xl p-8 animate-scale-in">
          {}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/theflex-favicon-dark-green.png"
                  alt="Flex Living Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Create Account
            </h2>
            <p className="text-slate-600">
              Join Flex Living and start managing properties
            </p>
          </div>

          {}
          {error && (
            <div className="mb-6 animate-slide-up">
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">!</span>
                </div>
                {error}
              </div>
            </div>
          )}

          {}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#284E4C] to-[#1a3a38] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#284E4C] hover:text-[#1a3a38] transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
