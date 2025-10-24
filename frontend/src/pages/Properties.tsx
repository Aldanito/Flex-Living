import React from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  StarIcon,
  // HomeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export const Properties: React.FC = () => {
  const properties = [
    {
      id: "1",
      name: "Luxury Downtown Apartment",
      location: "New York, NY",
      rating: 4.9,
      reviewCount: 127,
      price: "$299/night",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Parking", "Kitchen", "Gym"],
    },
    {
      id: "2",
      name: "Modern City Loft",
      location: "San Francisco, CA",
      rating: 4.8,
      reviewCount: 89,
      price: "$399/night",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Parking", "Balcony", "Pool"],
    },
    {
      id: "3",
      name: "Executive Suite",
      location: "London, UK",
      rating: 4.9,
      reviewCount: 156,
      price: "$199/night",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Kitchen", "Gym", "Concierge"],
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen flex-bg">
      {/* Hero Section */}
      <div className="flex-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Premium Properties
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Experience luxury living with our carefully curated selection of
              furnished accommodations worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">View All Properties</button>
              <button className="btn-primary">Book Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold flex-text mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular destinations and premium accommodations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="glass-card rounded-2xl overflow-hidden card-hover"
              >
                {/* Property Image */}
                <div className="relative h-64">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">
                        {property.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold flex-text">
                      {property.name}
                    </h3>
                    <span className="text-2xl font-bold text-[#284E4C]">
                      {property.price}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{property.location}</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(property.rating))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {property.reviewCount} reviews
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-[#284E4C]/10 text-[#284E4C] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/reviews/${property.id}`}
                      className="flex-1 btn-secondary text-center"
                    >
                      View Reviews
                    </Link>
                    <button className="flex-1 btn-primary">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold flex-text mb-4">
              Ready to Experience The Flex?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests who have made The Flex Global
              their home away from home.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Explore All Properties
              <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
