import React, { useState, useEffect } from "react";
import type { Review } from "../types";
import apiService from "../services/api";

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
}

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  reviews: Review[];
  onApprove: (reviewId: string, listingId: string, source: string) => void;
  onUnapprove: (reviewId: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  reviews,
  onApprove,
  onUnapprove,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen && propertyId) {
      loadPropertyData();
    }
  }, [isOpen, propertyId]);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      // Check if propertyId is a MongoDB ObjectId (24 hex characters) or a Google Place ID
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);

      if (isMongoId) {
        // It's a MongoDB ObjectId, fetch directly
        const response = await apiService.getProperty(propertyId);
        setProperty(response.data);
      } else {
        // It's a Google Place ID or listing ID, we can't fetch property details
        console.log("Property ID is not a MongoDB ObjectId, skipping API call");
        setProperty(null);
      }
    } catch (err) {
      console.error("Error loading property details:", err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const propertyReviews = reviews.filter(
    (review) =>
      review.propertyId === propertyId || review.listingId === propertyId
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-[#284E4C] to-[#1a3a38] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Property Preview: {propertyName}
                </h2>
                <p className="text-white/80">
                  What users will see when this property is approved
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <span className="ml-3 text-gray-600">
                  Loading property details...
                </span>
              </div>
            ) : property ? (
              <div className="space-y-6">
                {/* Property Preview Header */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {property.name}
                    </h3>
                    {property.approved && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                        ✓ Approved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>👥 {property.maxGuests} Guests</span>
                    <span>
                      🏠{" "}
                      {property.bedrooms === 0
                        ? "Studio"
                        : `${property.bedrooms} Bedroom${
                            property.bedrooms > 1 ? "s" : ""
                          }`}
                    </span>
                    <span>
                      🛁 {property.bathrooms} Bathroom
                      {property.bathrooms > 1 ? "s" : ""}
                    </span>
                    <span>📐 {property.size} m²</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                    <span>📍 {property.address}</span>
                  </div>
                </div>

                {/* Image Gallery Preview */}
                {property.images && property.images.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Property Images
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden">
                          <img
                            src={
                              property.images[selectedImage] ||
                              property.images[0]
                            }
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {property.images.slice(0, 6).map((image, index) => (
                          <div
                            key={index}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                              selectedImage === index
                                ? "border-blue-500"
                                : "border-gray-200"
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
                        {property.images.length > 6 && (
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            +{property.images.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Property Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">
                          {property.propertyType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Stay:</span>
                        <span className="font-medium">
                          {property.minimumStay} night
                          {property.minimumStay > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Night:</span>
                        <span className="font-medium">
                          £{property.pricePerNight || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Month:</span>
                        <span className="font-medium">
                          £{property.pricePerMonth || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Amenities
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.slice(0, 8).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 text-sm"
                        >
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                      {property.amenities.length > 8 && (
                        <div className="text-sm text-gray-500">
                          +{property.amenities.length - 8} more amenities
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Reviews ({propertyReviews.length})
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {propertyReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {review.reviewerName}
                              </h5>
                              <span className="text-xs font-medium text-gray-600">
                                {review.rating}/5
                              </span>
                              <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {review.source}
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs mb-1">
                              {review.reviewText}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2">
                            {review.approval?.isApproved ? (
                              <div className="flex items-center space-x-1">
                                <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded-full bg-green-600 text-white">
                                  Approved
                                </span>
                                <button
                                  onClick={() => onUnapprove(review.id)}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                  Unapprove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  onApprove(
                                    review.id,
                                    review.listingId,
                                    review.source
                                  )
                                }
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {propertyReviews.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>No reviews found for this property.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fallback Property Header */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {propertyName}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ Property data not available
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                    <span>📍 Property ID: {propertyId}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      This property is associated with reviews but detailed
                      property information is not available in the database.
                    </p>
                  </div>
                </div>

                {/* Reviews Section for Fallback */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Reviews ({propertyReviews.length})
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {propertyReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {review.reviewerName}
                              </h5>
                              <span className="text-xs font-medium text-gray-600">
                                {review.rating}/5
                              </span>
                              <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {review.source}
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs mb-1">
                              {review.reviewText}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2">
                            {review.approval?.isApproved ? (
                              <div className="flex items-center space-x-1">
                                <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded-full bg-green-600 text-white">
                                  Approved
                                </span>
                                <button
                                  onClick={() => onUnapprove(review.id)}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                  Unapprove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  onApprove(
                                    review.id,
                                    review.listingId,
                                    review.source
                                  )
                                }
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {propertyReviews.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>No reviews found for this property.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
