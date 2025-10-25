import React from "react";
import type { ReviewFilters as ReviewFiltersType } from "../types/index";
import { CustomDropdown } from "./CustomDropdown";
import { CustomDatePicker } from "./CustomDatePicker";

interface ReviewFiltersProps {
  filters: ReviewFiltersType;
  onFilterChange: (filters: Partial<ReviewFiltersType>) => void;
  totalReviews: number;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  onFilterChange,
  totalReviews,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Reviews ({totalReviews.toLocaleString()})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {}
        <div>
          <label
            htmlFor="listingId"
            className="block text-sm font-medium text-gray-700"
          >
            Listing ID
          </label>
          <input
            type="text"
            id="listingId"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#284E4C] focus:border-[#284E4C] sm:text-sm"
            placeholder="e.g., 12345"
            value={filters.listingId || ""}
            onChange={(e) =>
              onFilterChange({ listingId: e.target.value || undefined })
            }
          />
        </div>

        {}
        <CustomDropdown
          label="Source"
          options={[
            { value: "", label: "All Sources" },
            { value: "hostaway", label: "Hostaway" },
            { value: "google", label: "Google" },
          ]}
          value={filters.source || ""}
          onChange={(value) =>
            onFilterChange({
              source: (value as "hostaway" | "google") || undefined,
            })
          }
          placeholder="All Sources"
        />

        {}
        <CustomDropdown
          label="Rating"
          options={[
            { value: "", label: "All Ratings" },
            { value: "5", label: "5" },
            { value: "4", label: "4" },
            { value: "3", label: "3" },
            { value: "2", label: "2" },
            { value: "1", label: "1" },
          ]}
          value={filters.rating?.toString() || ""}
          onChange={(value) =>
            onFilterChange({
              rating: value ? parseInt(value) : undefined,
            })
          }
          placeholder="All Ratings"
        />

        {}
        <div>
          <label
            htmlFor="channel"
            className="block text-sm font-medium text-gray-700"
          >
            Channel
          </label>
          <input
            type="text"
            id="channel"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#284E4C] focus:border-[#284E4C] sm:text-sm"
            placeholder="e.g., airbnb, booking.com"
            value={filters.channel || ""}
            onChange={(e) =>
              onFilterChange({ channel: e.target.value || undefined })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {}
        <CustomDatePicker
          label="From Date"
          value={filters.dateFrom || ""}
          onChange={(value) => onFilterChange({ dateFrom: value || undefined })}
          placeholder="Select start date"
        />

        {}
        <CustomDatePicker
          label="To Date"
          value={filters.dateTo || ""}
          onChange={(value) => onFilterChange({ dateTo: value || undefined })}
          placeholder="Select end date"
        />
      </div>

      {}
      <div className="flex justify-end">
        <button
          onClick={() =>
            onFilterChange({
              listingId: undefined,
              source: undefined,
              rating: undefined,
              channel: undefined,
              dateFrom: undefined,
              dateTo: undefined,
              offset: 0,
            })
          }
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#284E4C]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
