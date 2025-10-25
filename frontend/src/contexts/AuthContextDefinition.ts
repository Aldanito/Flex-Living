import { createContext } from "react";
import type { User } from "../types/index";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "manager" | "admin"
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
