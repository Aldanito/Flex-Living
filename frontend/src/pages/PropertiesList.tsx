import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPinIcon,
  HomeIcon,
  UserGroupIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { PropertyMap } from "../components/PropertyMap";
import { useSearch } from "../hooks/useSearch";
import apiService from "../services/api";

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

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export const PropertiesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { filters, setFilters } = useSearch();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    const urlFilters = {
      location: searchParams.get("location") || "LONDON",
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: parseInt(searchParams.get("guests") || "1"),
      bedrooms: searchParams.get("bedrooms")
        ? parseInt(searchParams.get("bedrooms")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
    };
    setFilters(urlFilters);
  }, [searchParams, setFilters]);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);

      const cityName =
        filters.location.charAt(0) + filters.location.slice(1).toLowerCase();
      const apiFilters = {
        city: cityName,
        minBedrooms: filters.bedrooms?.toString() || "",
        maxPrice: filters.maxPrice?.toString() || "",
        guests: filters.guests.toString(),
      };

      const response = await apiService.getPublicProperties(apiFilters);

      setProperties(response.data || []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProperties();
  }, [filters, loadProperties]);

  useEffect(() => {
    if (filters.guests) {
      loadProperties();
    }
  }, [filters.guests, loadProperties]);

  const formatPrice = (property: Property) => {
    if (property.pricePerNight) {
      return `£${property.pricePerNight} per night`;
    }
    if (property.pricePerMonth) {
      return `£${property.pricePerMonth} per month`;
    }
    return "Price on request";
  };

  return (
    <div className="min-h-screen bg-white">
      {}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#284E4C]">
              {properties.length} properties found in{" "}
              {filters.location.charAt(0) +
                filters.location.slice(1).toLowerCase()}
              {filters.guests > 1 && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  (for {filters.guests} guests)
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {}
      <div className="flex h-[calc(100vh-120px)]">
        {}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                      selectedProperty === property._id
                        ? "border-[#284E4C] shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedProperty(property._id);
                      navigate(`/properties/${property._id}`);
                    }}
                  >
                    {}
                    <div className="relative h-64 rounded-t-lg overflow-hidden">
                      <img
                        src={
                          property.images[0] ||
                          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
                        }
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                      {}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-[#284E4C] font-bold text-sm">
                          {formatPrice(property)}
                        </span>
                      </div>
                      {}
                      <button className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <HeartIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {property.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.address}</span>
                      </div>

                      {}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1" />
                          <span>
                            {property.bedrooms === 0
                              ? "Studio"
                              : `${property.bedrooms} Bedroom${
                                  property.bedrooms > 1 ? "s" : ""
                                }`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span>•</span>
                          <span className="ml-1">
                            {property.bathrooms} Bathroom
                            {property.bathrooms > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          <span>Up to {property.maxGuests} guests</span>
                        </div>
                      </div>

                      {}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {property.amenities
                          .slice(0, 3)
                          .map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                        {property.amenities.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="w-1/2 border-l border-gray-200">
          <PropertyMap
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={setSelectedProperty}
            city={filters.location}
          />
        </div>
      </div>

      {}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#284E4C] mb-4">
              Discover furnished monthly apartments for rent in London
            </h2>
            <div className="max-w-4xl mx-auto text-gray-600 space-y-4">
              <p>
                The Flex offers a wide range of furnished apartments for rent in
                London, perfect for both short-term and long-term stays. Our
                properties are carefully selected and fully equipped with modern
                amenities.
              </p>
              <p>
                All our apartments include utilities, high-speed Wi-Fi, fully
                stocked kitchens, fresh linens, and local support. Whether
                you're relocating for work, studying, or just exploring the
                city, we have flexible lease options to suit your needs.
              </p>
            </div>
          </div>

          {}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#284E4C] mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {[
                {
                  question:
                    "Does The Flex offer both short term and long term rentals in London?",
                  answer:
                    "Yes! The Flex offers flexible rental options ranging from 1 month to 12+ months. Whether you need a short-term corporate stay or a long-term relocation solution, we have properties and lease terms to suit your needs.",
                },
                {
                  question: "Can I book a corporate apartment in London?",
                  answer:
                    "Absolutely! The Flex specializes in corporate housing solutions. We work with businesses of all sizes to provide furnished apartments for relocating employees, business travelers, and corporate clients. Contact us for corporate rates and dedicated account management.",
                },
                {
                  question:
                    "What is included in The Flex's serviced apartments in London?",
                  answer:
                    "All our serviced apartments include: fully furnished living spaces, high-speed WiFi, utilities (electricity, gas, water), weekly cleaning service, fresh linens and towels, fully equipped kitchen with appliances, 24/7 support, and access to building amenities like gyms and business centers.",
                },
                {
                  question: "Can a foreigner rent an apartment in London?",
                  answer:
                    "Yes, foreigners can rent apartments in London through The Flex. We accept various forms of identification and can work with international clients. We may require additional documentation such as employment letters, bank statements, or references depending on your situation.",
                },
                {
                  question: "How much is monthly rent in London?",
                  answer:
                    "Monthly rent varies by location, size, and amenities. Our furnished apartments in London typically range from £2,500 to £8,000+ per month depending on the area and property type. Contact us for specific pricing based on your requirements and preferred locations.",
                },
              ].map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
