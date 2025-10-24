import React from "react";
import type { User } from "../types/index";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout,
}) => {
  return (
    <header className="glass-card border-0 rounded-none shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/theflex-favicon-dark-green.png"
                alt="Flex Living Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {user?.email}
              </p>
              <p className="text-xs text-slate-500 capitalize font-medium">
                {user?.role} • Online
              </p>
            </div>
            <button
              onClick={onLogout}
              className="btn-primary text-sm px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
