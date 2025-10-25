import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useSearch } from "../hooks/useSearch";

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { filters, updateFilter } = useSearch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const cities = [
    { value: "LONDON", label: "London" },
    { value: "PARIS", label: "Paris" },
    { value: "ALGIERS", label: "Algiers" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("location", filters.location);
    searchParams.set("guests", filters.guests.toString());
    if (filters.checkIn) searchParams.set("checkIn", filters.checkIn);
    if (filters.checkOut) searchParams.set("checkOut", filters.checkOut);
    if (filters.bedrooms)
      searchParams.set("bedrooms", filters.bedrooms.toString());
    if (filters.maxPrice)
      searchParams.set("maxPrice", filters.maxPrice.toString());

    navigate(`/properties?${searchParams.toString()}`);
  };

  const formatDateRange = () => {
    if (filters.checkIn && filters.checkOut) {
      const startDate = new Date(filters.checkIn).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endDate = new Date(filters.checkOut).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
    return "Dates";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {}
      <div
        className="flex items-center space-x-2 flex-1 relative group cursor-pointer"
        ref={locationDropdownRef}
        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
      >
        <MapPinIcon className="h-5 w-5 text-gray-400 group-hover:text-[#284E4C] transition-colors" />
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-700 font-medium group-hover:text-[#284E4C] transition-colors">
            {cities.find((city) => city.value === filters.location)?.label ||
              "London"}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-[#284E4C] transition-colors" />
        </div>

        {}
        {showLocationDropdown && (
          <div className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-2xl z-[9999] min-w-[220px] overflow-hidden border border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {cities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => {
                    updateFilter("location", city.value);
                    setShowLocationDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center justify-between ${
                    filters.location === city.value
                      ? "bg-[#284E4C] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{city.label}</span>
                  {filters.location === city.value && (
                    <CheckIcon className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {}
      <div className="w-px h-8 bg-gray-200"></div>

      {}
      <div
        className="flex items-center space-x-2 flex-1 relative group cursor-pointer"
        ref={datePickerRef}
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <CalendarDaysIcon className="h-5 w-5 text-gray-400 group-hover:text-[#284E4C] transition-colors" />
        <div className="flex items-center space-x-2 flex-1">
          <span className="text-gray-700 font-medium group-hover:text-[#284E4C] transition-colors">
            {formatDateRange()}
          </span>
        </div>
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-xl shadow-2xl p-6 z-[9999] min-w-[320px] animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select your dates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={filters.checkIn}
                    onChange={(e) => updateFilter("checkIn", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={filters.checkOut}
                    onChange={(e) => updateFilter("checkOut", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-full bg-[#284E4C] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#1A3A38] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Apply Dates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {}
      <div className="w-px h-8 bg-gray-200"></div>

      {}
      <div className="flex items-center space-x-2 flex-1 group">
        <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-[#284E4C] transition-colors" />
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              updateFilter("guests", Math.max(1, filters.guests - 1))
            }
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#284E4C] hover:text-white hover:border-[#284E4C] transition-all duration-200 hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <span className="text-gray-700 font-semibold min-w-[30px] text-center group-hover:text-[#284E4C] transition-colors">
            {filters.guests}
          </span>
          <button
            onClick={() => updateFilter("guests", filters.guests + 1)}
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#284E4C] hover:text-white hover:border-[#284E4C] transition-all duration-200 hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
        <span className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors">
          Guest{filters.guests !== 1 ? "s" : ""}
        </span>
      </div>

      {}
      <div className="w-px h-8 bg-gray-200"></div>

      {}
      <button
        onClick={handleSearch}
        className="flex items-center space-x-2 bg-[#284E4C] text-white px-8 py-3 rounded-xl hover:bg-[#1A3A38] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Search</span>
      </button>
    </div>
  );
};
