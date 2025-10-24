import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-flex-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-flex-teal mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
