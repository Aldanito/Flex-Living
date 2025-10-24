import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export const Footer: React.FC = () => {
  return (
    <footer className="flex-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-[#284E4C]">F</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">The Flex</h3>
                <p className="text-sm text-gray-300">Global Living</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Experience premium living with The Flex Global. We provide
              exceptional furnished accommodations for business travelers and
              digital nomads worldwide.
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm">Global Locations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <BuildingOfficeIcon className="h-4 w-4" />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <UserGroupIcon className="h-4 w-4" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <EnvelopeIcon className="h-4 w-4" />
                <span className="text-sm">hello@theflex.global</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-sm">Global Locations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 The Flex Global. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
