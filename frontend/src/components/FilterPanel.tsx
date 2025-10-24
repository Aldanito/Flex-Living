import React, { useState } from "react";
import type { ReviewFilters } from "../types/index";
import { CustomDropdown } from "./CustomDropdown";
import { CustomDatePicker } from "./CustomDatePicker";

interface FilterPanelProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof ReviewFilters,
    value: string | number | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex space-x-2">
          <button onClick={onReset} className="btn btn-secondary btn-sm">
            Reset
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-primary btn-sm"
          >
            {isOpen ? "Hide" : "Show"} Filters
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rating Filter */}
          <CustomDropdown
            label="Minimum Rating"
            options={[
              { value: "", label: "All Ratings" },
              { value: "8", label: "8+ Stars" },
              { value: "9", label: "9+ Stars" },
              { value: "10", label: "10 Stars" },
            ]}
            value={filters.rating?.toString() || ""}
            onChange={(value) =>
              handleFilterChange("rating", value ? parseInt(value) : undefined)
            }
            placeholder="All Ratings"
          />

          {/* Source Filter */}
          <CustomDropdown
            label="Source"
            options={[
              { value: "", label: "All Sources" },
              { value: "hostaway", label: "Hostaway" },
              { value: "google", label: "Google" },
            ]}
            value={filters.source || ""}
            onChange={(value) =>
              handleFilterChange("source", value || undefined)
            }
            placeholder="All Sources"
          />

          {/* Status Filter */}
          <CustomDropdown
            label="Status"
            options={[
              { value: "", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
            value={filters.status || ""}
            onChange={(value) =>
              handleFilterChange("status", value || undefined)
            }
            placeholder="All Statuses"
          />

          {/* Property Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property
            </label>
            <input
              type="text"
              value={filters.property || ""}
              onChange={(e) =>
                handleFilterChange("property", e.target.value || undefined)
              }
              placeholder="Search by property name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#284E4C] focus:border-[#284E4C] sm:text-sm"
            />
          </div>

          {/* Date Range */}
          <CustomDatePicker
            label="From Date"
            value={filters.dateFrom || ""}
            onChange={(value) =>
              handleFilterChange("dateFrom", value || undefined)
            }
            placeholder="Select start date"
          />

          <CustomDatePicker
            label="To Date"
            value={filters.dateTo || ""}
            onChange={(value) =>
              handleFilterChange("dateTo", value || undefined)
            }
            placeholder="Select end date"
          />

          {/* Sort Options */}
          <CustomDropdown
            label="Sort By"
            options={[
              { value: "submittedAt", label: "Date" },
              { value: "rating", label: "Rating" },
              { value: "reviewerName", label: "Reviewer" },
              { value: "listingName", label: "Property" },
            ]}
            value={filters.sortBy || "submittedAt"}
            onChange={(value) => handleFilterChange("sortBy", value)}
            placeholder="Sort By"
          />

          <CustomDropdown
            label="Order"
            options={[
              { value: "desc", label: "Newest First" },
              { value: "asc", label: "Oldest First" },
            ]}
            value={filters.sortOrder || "desc"}
            onChange={(value) =>
              handleFilterChange("sortOrder", value as "asc" | "desc")
            }
            placeholder="Order"
          />
        </div>
      )}

      {/* Active Filters Display */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (
              !value ||
              key === "page" ||
              key === "limit" ||
              key === "sortBy" ||
              key === "sortOrder"
            ) {
              return null;
            }
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {key}: {value}
                <button
                  onClick={() =>
                    handleFilterChange(key as keyof ReviewFilters, undefined)
                  }
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
