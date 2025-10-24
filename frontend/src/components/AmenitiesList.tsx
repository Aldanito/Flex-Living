import React from "react";

interface AmenitiesListProps {
  amenities: string[];
}

const amenityIcons: Record<string, string> = {
  WiFi: "📶",
  "High-Speed WiFi": "📶",
  Kitchen: "🍳",
  "Full Kitchen": "🍳",
  Kitchenette: "🍳",
  "Air Conditioning": "❄️",
  Heating: "🔥",
  "Washing Machine": "🧺",
  Dryer: "🌀",
  Dishwasher: "🍽️",
  TV: "📺",
  "Smart TV": "📺",
  "Smart TVs": "📺",
  Balcony: "🏡",
  "Coffee Maker": "☕",
  "Coffee Machine": "☕",
  "Nespresso Machine": "☕",
  Microwave: "📻",
  Refrigerator: "🧊",
  Oven: "🔥",
  "Desk & Chair": "💼",
  Desk: "💼",
  "Office Setup": "💼",
  "Office Space": "💼",
  "Ergonomic Chair": "🪑",
  Monitor: "🖥️",
  Gym: "🏋️",
  "Building Gym": "🏋️",
  Parking: "🚗",
  "Parking Available": "🚗",
  "Smart Lock": "🔐",
  "Premium Bedding": "🛏️",
  "Dining Table": "🍽️",
  "Eiffel Tower View": "🗼",
  "2 Bathrooms": "🚿",
};

const AmenitiesList: React.FC<AmenitiesListProps> = ({ amenities }) => {
  const getIcon = (amenity: string): string => {
    return amenityIcons[amenity] || "✓";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="text-2xl">{getIcon(amenity)}</span>
          <span className="text-sm font-medium text-gray-700">{amenity}</span>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesList;
