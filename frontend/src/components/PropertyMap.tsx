import React, { useState, useEffect } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Property {
  _id: string;
  name: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight?: number;
  pricePerMonth?: number;
  images: string[];
  amenities: string[];
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: string | null;
  onPropertySelect: (propertyId: string) => void;
  city?: string;
}

const cityConfigs = {
  LONDON: {
    center: { lat: 51.5074, lng: -0.1278 },
    name: "London",
    coordinates: [
      { lat: 51.5074, lng: -0.1278 },
      { lat: 51.5045, lng: -0.0865 },
      { lat: 51.5154, lng: -0.0922 },
      { lat: 51.5308, lng: -0.1238 },
      { lat: 51.5074, lng: -0.1195 },
      { lat: 51.4994, lng: -0.1245 },
      { lat: 51.5055, lng: -0.0754 },
      { lat: 51.5186, lng: -0.0814 },
      { lat: 51.5152, lng: -0.1419 },
      { lat: 51.5014, lng: -0.1419 },
      { lat: 51.5128, lng: -0.0913 },
      { lat: 51.5076, lng: -0.0994 },
      { lat: 51.52, lng: -0.0972 },
      { lat: 51.5048, lng: -0.1065 },
      { lat: 51.5099, lng: -0.118 },
    ],
    landmarks: [
      { name: "Tower Bridge", lat: 51.5055, lng: -0.0754, color: "bg-red-500" },
      {
        name: "Canary Wharf",
        lat: 51.5045,
        lng: -0.0865,
        color: "bg-blue-500",
      },
      {
        name: "Westminster",
        lat: 51.4994,
        lng: -0.1245,
        color: "bg-yellow-500",
      },
      {
        name: "City of London",
        lat: 51.5154,
        lng: -0.0922,
        color: "bg-purple-500",
      },
      {
        name: "King's Cross",
        lat: 51.5308,
        lng: -0.1238,
        color: "bg-orange-500",
      },
      {
        name: "London Bridge",
        lat: 51.5048,
        lng: -0.1065,
        color: "bg-pink-500",
      },
      {
        name: "London Eye",
        lat: 51.5033,
        lng: -0.1195,
        color: "bg-indigo-500",
      },
    ],
    districts: [
      { name: "Camden", lat: 51.539, lng: -0.1426 },
      { name: "Islington", lat: 51.544, lng: -0.1027 },
      { name: "City", lat: 51.5154, lng: -0.0922 },
      { name: "Tower Hamlets", lat: 51.5203, lng: -0.0293 },
      { name: "Southwark", lat: 51.5033, lng: -0.1195 },
      { name: "Lambeth", lat: 51.4952, lng: -0.1245 },
      { name: "Westminster", lat: 51.4994, lng: -0.1245 },
    ],
  },
  PARIS: {
    center: { lat: 48.8566, lng: 2.3522 },
    name: "Paris",
    coordinates: [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 48.8584, lng: 2.2945 },
      { lat: 48.8606, lng: 2.3376 },
      { lat: 48.8738, lng: 2.295 },
      { lat: 48.8566, lng: 2.3522 },
      { lat: 48.85, lng: 2.35 },
      { lat: 48.87, lng: 2.33 },
      { lat: 48.84, lng: 2.32 },
      { lat: 48.86, lng: 2.28 },
      { lat: 48.85, lng: 2.38 },
    ],
    landmarks: [
      { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, color: "bg-red-500" },
      { name: "Louvre", lat: 48.8606, lng: 2.3376, color: "bg-blue-500" },
      {
        name: "Arc de Triomphe",
        lat: 48.8738,
        lng: 2.295,
        color: "bg-yellow-500",
      },
      { name: "Notre-Dame", lat: 48.8566, lng: 2.3522, color: "bg-purple-500" },
      { name: "Montmartre", lat: 48.8867, lng: 2.3431, color: "bg-orange-500" },
    ],
    districts: [
      { name: "1st Arrondissement", lat: 48.8606, lng: 2.3376 },
      { name: "4th Arrondissement", lat: 48.8566, lng: 2.3522 },
      { name: "7th Arrondissement", lat: 48.8584, lng: 2.2945 },
      { name: "8th Arrondissement", lat: 48.8738, lng: 2.295 },
      { name: "18th Arrondissement", lat: 48.8867, lng: 2.3431 },
    ],
  },
  ALGIERS: {
    center: { lat: 36.7538, lng: 3.0588 },
    name: "Algiers",
    coordinates: [
      { lat: 36.7538, lng: 3.0588 },
      { lat: 36.76, lng: 3.05 },
      { lat: 36.74, lng: 3.07 },
      { lat: 36.75, lng: 3.04 },
      { lat: 36.77, lng: 3.06 },
      { lat: 36.73, lng: 3.08 },
      { lat: 36.76, lng: 3.03 },
      { lat: 36.72, lng: 3.09 },
    ],
    landmarks: [
      { name: "Casbah", lat: 36.76, lng: 3.05, color: "bg-red-500" },
      {
        name: "Notre Dame d'Afrique",
        lat: 36.8,
        lng: 3.04,
        color: "bg-blue-500",
      },
      {
        name: "Martyrs Memorial",
        lat: 36.75,
        lng: 3.06,
        color: "bg-yellow-500",
      },
    ],
    districts: [
      { name: "Casbah", lat: 36.76, lng: 3.05 },
      { name: "Hydra", lat: 36.74, lng: 3.07 },
      { name: "Bab Ezzouar", lat: 36.75, lng: 3.04 },
      { name: "El Harrach", lat: 36.77, lng: 3.06 },
    ],
  },
};

const getMockCoordinates = (index: number, city: string) => {
  const config =
    cityConfigs[city as keyof typeof cityConfigs] || cityConfigs.LONDON;
  return config.coordinates[index % config.coordinates.length];
};

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  city = "LONDON",
}) => {
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [zoom, setZoom] = useState(12);

  const cityConfig =
    cityConfigs[city as keyof typeof cityConfigs] || cityConfigs.LONDON;
  const mapCenter = cityConfig.center;

  useEffect(() => {

  }, [properties]);

  const handlePropertyClick = (propertyId: string) => {
    onPropertySelect(propertyId);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 8));
  };

  const latLngToPixel = (lat: number, lng: number, cityName: string) => {
    const centerLat = mapCenter.lat;
    const centerLng = mapCenter.lng;

    let latRange, lngRange;
    switch (cityName) {
      case "LONDON":
        latRange = 0.4;
        lngRange = 0.8;
        break;
      case "PARIS":
        latRange = 0.2;
        lngRange = 0.3;
        break;
      case "ALGIERS":
        latRange = 0.2;
        lngRange = 0.2;
        break;
      default:
        latRange = 0.4;
        lngRange = 0.8;
    }

    const relativeLat = (lat - (centerLat - latRange / 2)) / latRange;
    const relativeLng = (lng - (centerLng - lngRange / 2)) / lngRange;

    const x = 10 + relativeLng * 80;
    const y = 15 + relativeLat * 70;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
        {}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-blue-300 opacity-60 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-400 opacity-40 transform -translate-y-1/2"></div>

        {}
        <div className="absolute top-20 left-0 w-full h-0.5 bg-gray-400 opacity-30"></div>
        <div className="absolute top-40 left-0 w-full h-0.5 bg-gray-400 opacity-30"></div>
        <div className="absolute top-60 left-0 w-full h-0.5 bg-gray-400 opacity-30"></div>
        <div className="absolute top-80 left-0 w-full h-0.5 bg-gray-400 opacity-30"></div>

        <div className="absolute top-0 left-20 w-0.5 h-full bg-gray-400 opacity-30"></div>
        <div className="absolute top-0 left-40 w-0.5 h-full bg-gray-400 opacity-30"></div>
        <div className="absolute top-0 left-60 w-0.5 h-full bg-gray-400 opacity-30"></div>
        <div className="absolute top-0 left-80 w-0.5 h-full bg-gray-400 opacity-30"></div>

        {}
        <div
          className="absolute top-15 right-20 w-12 h-8 bg-green-200 rounded-lg opacity-50"
          title="Hyde Park"
        ></div>
        <div
          className="absolute top-25 left-15 w-8 h-6 bg-green-200 rounded-lg opacity-50"
          title="Regent's Park"
        ></div>
        <div
          className="absolute bottom-20 left-30 w-10 h-6 bg-green-200 rounded-lg opacity-50"
          title="Greenwich Park"
        ></div>

        {}
        {cityConfig.landmarks.map((landmark, index) => {
          const pixelPos = latLngToPixel(landmark.lat, landmark.lng, city);
          return (
            <div
              key={index}
              className={`absolute w-3 h-3 ${landmark.color} rounded-full opacity-70 flex items-center justify-center`}
              style={{ left: `${pixelPos.x}%`, top: `${pixelPos.y}%` }}
              title={landmark.name}
            >
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          );
        })}

        {}
        <div
          className="absolute top-25 left-30 w-1 h-1 bg-gray-600 rounded-full opacity-60"
          title="Oxford Circus"
        ></div>
        <div
          className="absolute top-45 left-40 w-1 h-1 bg-gray-600 rounded-full opacity-60"
          title="Bank"
        ></div>
        <div
          className="absolute top-55 right-35 w-1 h-1 bg-gray-600 rounded-full opacity-60"
          title="Waterloo"
        ></div>
        <div
          className="absolute top-30 left-60 w-1 h-1 bg-gray-600 rounded-full opacity-60"
          title="Liverpool Street"
        ></div>
        <div
          className="absolute top-40 right-45 w-1 h-1 bg-gray-600 rounded-full opacity-60"
          title="Covent Garden"
        ></div>

        {}
        {cityConfig.districts.map((district, index) => {
          const pixelPos = latLngToPixel(district.lat, district.lng, city);
          return (
            <div
              key={index}
              className="absolute text-xs text-gray-500 opacity-60 font-medium"
              style={{ left: `${pixelPos.x}%`, top: `${pixelPos.y}%` }}
            >
              {district.name}
            </div>
          );
        })}
      </div>

      {}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-medium">+</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-medium">−</span>
          </button>
        </div>
      </div>

      {}
      <div className="absolute inset-0">
        {properties.map((property, index) => {
          const coords = getMockCoordinates(index, city);
          const pixelPos = latLngToPixel(coords.lat, coords.lng, city);
          const isSelected = selectedProperty === property._id;
          const isHovered = hoveredProperty === property._id;

          return (
            <div
              key={property._id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                isSelected ? "z-20" : "z-10"
              }`}
              style={{ left: `${pixelPos.x}%`, top: `${pixelPos.y}%` }}
              onClick={() => handlePropertyClick(property._id)}
              onMouseEnter={() => setHoveredProperty(property._id)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 bg-[#284E4C] rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "scale-125 ring-4 ring-[#284E4C]/30"
                      : isHovered
                      ? "scale-110"
                      : "hover:scale-110"
                  }`}
                >
                  <MapPinIcon className="h-5 w-5 text-white" />
                </div>

                {}
                {(isSelected || isHovered) && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 min-w-[250px] z-30 border border-gray-200">
                    <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {property.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {property.address}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-[#284E4C]">
                        £
                        {property.pricePerNight ||
                          property.pricePerMonth ||
                          "N/A"}{" "}
                        {property.pricePerNight ? "per night" : "per month"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </div>
                    </div>
                    {}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 z-10 max-w-32">
        <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Landmarks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <span className="text-gray-600">Tube Stations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-green-200 rounded"></div>
            <span className="text-gray-600">Parks</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-0.5 bg-blue-300"></div>
            <span className="text-gray-600">Thames</span>
          </div>
        </div>
      </div>

      {}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded px-2 py-1">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-3 w-3" />
            <span>{cityConfig.name} Properties</span>
            <span>•</span>
            <span>Zoom: {zoom}</span>
            <span>•</span>
            <span
              className={
                properties.length === 0
                  ? "text-red-500 font-medium"
                  : "text-gray-700"
              }
            >
              {properties.length} properties
            </span>
            {properties.length === 0 && (
              <span className="text-red-500 text-xs">(filtered)</span>
            )}
          </div>
        </div>
      </div>

      {}
      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPinIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No properties found</p>
            <p className="text-sm">Try adjusting your search filters</p>
            <p className="text-xs mt-2 text-gray-400">
              Check guest count, location, or other criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
