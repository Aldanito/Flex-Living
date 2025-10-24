import React from "react";

export const PropertyAmenities: React.FC = () => {
  const amenities = [
    { name: "Cable TV", icon: "📺" },
    { name: "Internet", icon: "🌐" },
    { name: "Wireless", icon: "📶" },
    { name: "Kitchen", icon: "🍳" },
    { name: "Washing Machine", icon: "🧺" },
    { name: "Elevator", icon: "🛗" },
    { name: "Hair Dryer", icon: "💨" },
    { name: "Heating", icon: "🔥" },
    { name: "Smoke Detector", icon: "🚨" },
    { name: "Air Conditioning", icon: "❄️" },
    { name: "Parking", icon: "🅿️" },
    { name: "Gym", icon: "💪" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
        <button className="text-flex-teal hover:text-opacity-80 font-medium">
          View all amenities &gt;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-xl">{amenity.icon}</span>
            <span className="text-gray-700">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
