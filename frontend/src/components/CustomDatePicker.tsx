import React, { useState, useEffect, useRef } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  label,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        ref={datePickerRef}
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:border-[#284E4C] focus:outline-none focus:ring-1 focus:ring-[#284E4C] focus:border-[#284E4C] transition-colors">
          <span className="text-gray-700 font-medium">{formatDate(value)}</span>
          <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-2xl z-[9999] overflow-hidden border border-gray-200">
            <div className="p-3">
              <input
                type="date"
                value={value}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#284E4C] focus:border-[#284E4C]"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
