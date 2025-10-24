import React from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { UserDropdown } from "./UserDropdown";
import { SearchBar } from "./SearchBar";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src="/theflex-favicon-dark-green.png"
                  alt="Flex Living Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/properties"
              className="text-gray-700 hover:text-[#284E4C] transition-colors flex items-center space-x-1"
            >
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Properties</span>
            </Link>

            {/* User Dropdown */}
            <UserDropdown />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#284E4C] transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-4">
          <SearchBar />
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-[#284E4C] transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/properties"
                className="text-gray-700 hover:text-[#284E4C] transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <BuildingOfficeIcon className="h-4 w-4" />
                <span>Properties</span>
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <UserDropdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
