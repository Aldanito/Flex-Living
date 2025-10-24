import React from "react";

interface PropertyLocationProps {
  listingId: string;
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({
  listingId: _listingId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>

      {/* Map placeholder */}
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-500">Interactive Map</p>
          <p className="text-sm text-gray-400">
            London City Airport highlighted
          </p>
        </div>
      </div>

      <div className="text-center">
        <a
          href="#"
          className="text-flex-teal hover:text-opacity-80 font-medium"
        >
          Browse more monthly apartment rentals in London
        </a>
      </div>
    </div>
  );
};
