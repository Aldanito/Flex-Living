import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthResponse } from "../types/index";
import apiService from "../services/api";
import { AuthContext } from "./AuthContextDefinition";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiService.login(email, password);

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: string = "manager"
  ) => {
    try {
      const response: AuthResponse = await apiService.register(
        email,
        password,
        role
      );

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setUser(response.user);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
