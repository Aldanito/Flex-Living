import React from "react";

export const PropertyPolicies: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Stay Policies</h2>

      <div className="space-y-6">
        {/* Check-in & Check-out */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Check-in & Check-out
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-in Time</p>
              <p className="font-medium text-gray-900">3:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out Time</p>
              <p className="font-medium text-gray-900">10:00 AM</p>
            </div>
          </div>
        </div>

        {/* House Rules */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            House Rules
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-red-500"
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
              <span className="text-gray-700">No smoking</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-red-500"
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
              <span className="text-gray-700">No pets</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-red-500"
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
              <span className="text-gray-700">No parties or events</span>
            </li>
            <li className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-gray-700">Security deposit required</span>
            </li>
          </ul>
        </div>

        {/* Cancellation Policy */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Cancellation Policy
          </h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">
                For stays less than 28 days:
              </p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                <li>• Full refund up to 14 days before check-in</li>
                <li>
                  • No refund for bookings less than 14 days before check-in
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                For stays of 28 days or more:
              </p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                <li>• Full refund up to 30 days before check-in</li>
                <li>
                  • No refund for bookings less than 30 days before check-in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
