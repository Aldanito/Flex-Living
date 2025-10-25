import React from "react";

interface PropertyPerformance {
  listingId: string;
  totalReviews: number;
  averageRating: number;
  performance: "excellent" | "good" | "average" | "poor";
}

interface PropertyPerformanceTableProps {
  propertyPerformance: PropertyPerformance[];
  onPropertySelect: (propertyId: string | null) => void;
  selectedProperty: string | null;
}

export const PropertyPerformanceTable: React.FC<
  PropertyPerformanceTableProps
> = ({ propertyPerformance, onPropertySelect, selectedProperty }) => {
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-[#284E4C] text-white";
      case "good":
        return "bg-[#284E4C] text-white";
      case "average":
        return "bg-[#284E4C] text-white";
      case "poor":
        return "bg-[#284E4C] text-white";
      default:
        return "bg-[#284E4C] text-white";
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "★";
      case "good":
        return "✓";
      case "average":
        return "○";
      case "poor":
        return "!";
      default:
        return "?";
    }
  };

  const sortedProperties = [...propertyPerformance].sort(
    (a, b) => b.averageRating - a.averageRating
  );

  if (propertyPerformance.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Property Performance
        </h2>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No property data available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Property performance data will appear here once reviews are
            available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Property Performance
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Performance metrics for all properties based on guest reviews
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Reviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.map((property) => (
              <tr
                key={property.listingId}
                className={`hover:bg-gray-50 ${
                  selectedProperty === property.listingId ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {property.listingId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.totalReviews.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-1">
                      {property.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-black">
                      {"★".repeat(Math.round(property.averageRating))}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(
                      property.performance
                    )}`}
                  >
                    <span className="mr-1">
                      {getPerformanceIcon(property.performance)}
                    </span>
                    {property.performance.charAt(0).toUpperCase() +
                      property.performance.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      onPropertySelect(
                        selectedProperty === property.listingId
                          ? null
                          : property.listingId
                      )
                    }
                    className={`${
                      selectedProperty === property.listingId
                        ? "text-black hover:text-gray-700"
                        : "text-[#284E4C] hover:text-[#1a3a38]"
                    }`}
                  >
                    {selectedProperty === property.listingId
                      ? "Deselect"
                      : "Select"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {}
      {selectedProperty && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Property Details: {selectedProperty}
            </h3>
            <button
              onClick={() => onPropertySelect(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {(() => {
            const property = propertyPerformance.find(
              (p) => p.listingId === selectedProperty
            );
            if (!property) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Total Reviews
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {property.totalReviews}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Average Rating
                  </h4>
                  <p className="text-2xl font-bold text-black">
                    {property.averageRating.toFixed(1)} ★
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Performance
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {getPerformanceIcon(property.performance)}{" "}
                    {property.performance.charAt(0).toUpperCase() +
                      property.performance.slice(1)}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
