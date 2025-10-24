import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { ListingReviewsResponse, Review } from "../types/index";
import apiService from "../services/api";
import {
  StarIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const ReviewDisplay: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (listingId) {
      loadReviews();
    }
  }, [listingId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response: ListingReviewsResponse =
        await apiService.getListingReviews(listingId!);
      // Only show approved reviews
      const approvedReviews = response.reviews.filter(
        (review) => review.approved || review.approval?.isApproved
      );
      setReviews(approvedReviews);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#284E4C] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold flex-text">Loading Reviews</h2>
          <p className="text-gray-600 mt-2">Fetching guest reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex-bg flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold flex-text mb-2">
            Error Loading Reviews
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={loadReviews} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-bg">
      {/* Hero Section */}
      <div className="flex-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Guest Reviews
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover what our guests say about their experience with The Flex
              Global
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(5)}</div>
                <span className="text-white font-semibold">5.0</span>
              </div>
              <div className="text-gray-300">•</div>
              <div className="text-gray-200">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold flex-text mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-600">
                Reviews will appear here once they are approved by our team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="glass-card rounded-2xl p-6 card-hover"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#284E4C] rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold flex-text">
                          {review.guestName ||
                            review.reviewerName ||
                            "Anonymous Guest"}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {formatDate(review.createdAt || review.reviewDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment || review.reviewText}
                    </p>
                  </div>

                  {/* Review Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Verified Stay</span>
                      </span>
                    </div>
                    <div className="text-[#284E4C] font-medium">
                      {review.rating}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience The Flex Global
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced our premium
            furnished accommodations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-secondary">View Properties</button>
            <button className="btn-primary">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};
