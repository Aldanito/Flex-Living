import React from "react";
import type { ListingReviewsResponse } from "../types/index";

interface ReviewsSectionProps {
  reviewsData: ListingReviewsResponse;
  selectedRating?: number;
  onRatingFilter: (rating?: number) => void;
  onLoadMore: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviewsData,
  selectedRating,
  onRatingFilter,
  onLoadMore,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  const getRatingFilterColor = (rating: number) => {
    if (selectedRating === rating) {
      return "bg-flex-teal text-white";
    }
    return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  if (reviewsData.reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No reviews yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to leave a review for this property.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Average rating:</span>
          <span className="text-lg font-semibold text-gray-900">
            {reviewsData.averageRating.toFixed(1)} ⭐
          </span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Rating Breakdown
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              reviewsData.ratingDistribution[
                rating as keyof typeof reviewsData.ratingDistribution
              ];
            const percentage =
              reviewsData.total > 0 ? (count / reviewsData.total) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-flex-teal h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Filter by Rating
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onRatingFilter(undefined)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !selectedRating
                ? "bg-flex-teal text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({reviewsData.total})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              reviewsData.ratingDistribution[
                rating as keyof typeof reviewsData.ratingDistribution
              ];
            return (
              <button
                key={rating}
                onClick={() => onRatingFilter(rating)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getRatingFilterColor(
                  rating
                )}`}
              >
                {rating} ⭐ ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsData.reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-start space-x-4">
              {/* Reviewer Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {review.reviewerName}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">
                      {review.rating}
                    </span>
                    <span className="text-sm">
                      {getRatingStars(review.rating)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.reviewDate)}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {review.reviewText}
                </p>

                {review.source === "google" && review.reviewerUrl && (
                  <div className="mt-2">
                    <a
                      href={review.reviewerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-flex-teal hover:text-opacity-80"
                    >
                      View on Google
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {reviewsData.reviews.length < reviewsData.total && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flex-teal"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};
