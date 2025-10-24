import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPinIcon,
  HomeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  StarIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import apiService from "../services/api";
import type { Review } from "../types/index";
import { PropertyMap } from "../components/PropertyMap";

interface Property {
  _id: string;
  name: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  size: number;
  pricePerNight?: number;
  pricePerMonth?: number;
  images: string[];
  amenities: string[];
  description?: string;
  propertyType: string;
  minimumStay: number;
  features: string[];
  nearbyTransport: string[];
  hostawayListingId?: string;
  approved?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const loadPropertyData = async (propertyId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getProperty(propertyId);
      setProperty(response.data);
    } catch (err) {
      setError("Failed to load property details");
      console.error("Error loading property details:", err);
      // Fallback to mock data
      setProperty({
        _id: propertyId,
        name: "Elegant 1 Bedroom Apartment in Bermondsey - The Flex London",
        address: "Bermondsey, London",
        city: "London",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 4,
        size: 45,
        pricePerNight: 168,
        pricePerMonth: 2500,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        ],
        amenities: [
          "Cable TV",
          "Internet",
          "Wireless",
          "Kitchen",
          "Washing Machine",
          "Hair Dryer",
          "Heating",
          "Smoke Detector",
          "Carbon Monoxide Detector",
        ],
        description:
          "Located in the vibrant and well-connected neighbourhood of Bermondsey, this stylish 1-bedroom flat offers comfortable living with modern finishes. The property features a bright open-plan kitchen and living area, a spacious double bedroom, and a sleek bathroom. Just a short walk from local cafes, shops, and transport links.",
        propertyType: "Apartment",
        minimumStay: 1,
        features: ["1 Bedroom", "1 Bathroom", "Up to 4 guests", "45 m²"],
        nearbyTransport: [
          "Bermondsey Station - 5 min walk",
          "London Bridge - 10 min",
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = useCallback(
    async (propertyId: string) => {
      try {
        setReviewsLoading(true);
        // Use the property's _id for consistency with the approval system
        const listingId = property?._id || propertyId;
        const response = await apiService.getListingReviews(listingId);
        setReviews(response.reviews);
      } catch (err: unknown) {
        console.error("Failed to load reviews:", err);
        // Don't set error state for reviews, just log it
      } finally {
        setReviewsLoading(false);
      }
    },
    [property?._id]
  );

  useEffect(() => {
    if (id) {
      loadPropertyData(id);
    }
  }, [id]);

  useEffect(() => {
    if (property && id) {
      loadReviews(id);
    }
  }, [property, id, loadReviews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#284E4C] mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Property Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            {error || "This property could not be loaded."}
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-block bg-[#284E4C] text-white px-6 py-3 rounded-lg"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/properties"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#284E4C] transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Properties</span>
            </Link>
            <div className="font-bold text-xl text-[#284E4C]">the flex.</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                    <img
                      src={property.images[selectedImage] || property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImage + 1} of {property.images.length}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {property.images.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-[#284E4C] ring-2 ring-[#284E4C]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${property.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Title and Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {property.name}
                </h1>
                {property.approved && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                    ✓ Approved
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="h-5 w-5" />
                  <span>{property.maxGuests} Guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HomeIcon className="h-5 w-5" />
                  <span>
                    {property.bedrooms === 0
                      ? "Studio"
                      : `${property.bedrooms} Bedroom${
                          property.bedrooms > 1 ? "s" : ""
                        }`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🛁</span>
                  <span>
                    {property.bathrooms} Bathroom
                    {property.bathrooms > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📐</span>
                  <span>{property.size} m²</span>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Minimum Stay</p>
                  <p className="font-medium">
                    {property.minimumStay} night
                    {property.minimumStay > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per Night</p>
                  <p className="font-medium">
                    £{property.pricePerNight || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per Month</p>
                  <p className="font-medium">
                    £{property.pricePerMonth || "N/A"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="mt-4 flex items-center space-x-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* About This Property */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
                <span className="text-[#284E4C] cursor-pointer ml-1">
                  Read more
                </span>
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Property Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                <button className="text-[#284E4C] hover:underline">
                  View all amenities &gt;
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Transport */}
            {property.nearbyTransport &&
              property.nearbyTransport.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Nearby Transport
                  </h2>
                  <div className="space-y-3">
                    {property.nearbyTransport.map((transport, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{transport}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Stay Policies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Stay Policies
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Check-in & Check-out
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Check-in Time</span>
                      <p className="font-medium">3:00 PM</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Check-out Time</span>
                      <p className="font-medium">10:00 AM</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    House Rules
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                      <span className="text-gray-700">No smoking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                      <span className="text-gray-700">No pets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                      <span className="text-gray-700">
                        No parties or events
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">
                        Security deposit required
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Cancellation Policy
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        For stays less than 28 days:
                      </p>
                      <p className="text-gray-600">
                        Full refund up to 14 days before check-in
                      </p>
                      <p className="text-gray-600">
                        No refund for bookings less than 14 days before check-in
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        For stays of 28 days or more:
                      </p>
                      <p className="text-gray-600">
                        Full refund up to 30 days before check-in
                      </p>
                      <p className="text-gray-600">
                        No refund for bookings less than 30 days before check-in
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <PropertyMap
                  properties={property ? [property] : []}
                  selectedProperty={property?._id || null}
                  onPropertySelect={() => {}}
                  city={property?.city || "LONDON"}
                />
              </div>
              <div className="mt-4">
                <Link
                  to="/properties"
                  className="text-[#284E4C] hover:underline"
                >
                  Browse more furnished rentals in {property?.city || "London"}
                </Link>
              </div>
            </div>

            {/* Guest Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Guest Reviews
              </h2>

              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#284E4C]"></div>
                  <span className="ml-3 text-gray-600">Loading reviews...</span>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {review.reviewerPhotoUrl ? (
                            <img
                              src={review.reviewerPhotoUrl}
                              alt={review.reviewerName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#284E4C] rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.reviewerName}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(review.reviewDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {review.reviewText}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#284E4C]/10 text-[#284E4C]">
                            {review.channel}
                          </span>
                          {review.source === "google" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                              Verified
                            </span>
                          )}
                        </div>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="max-w-md mx-auto">
                    <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to share your experience at this property.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#284E4C] rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Book Your Stay</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Select dates to see prices
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Check-in"
                        className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Check-out"
                        className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded text-gray-900 text-sm"
                    >
                      {[...Array(property.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i !== 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="w-full bg-white text-[#284E4C] py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors mb-3">
                  Check availability
                </button>

                <button className="w-full border border-white text-white py-3 rounded-lg font-medium hover:bg-white/10 transition-colors mb-4">
                  Send inquiry
                </button>

                <div className="text-center">
                  <p className="text-sm text-white/80">
                    Instant booking confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
