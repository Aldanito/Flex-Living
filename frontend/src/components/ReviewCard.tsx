import React from "react";
import type { Review } from "../types/index";

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onStatusChange?: (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => void;
  onTogglePublic?: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showActions = false,
  onStatusChange,
  onTogglePublic,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="star star-filled"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="star star-filled"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${i})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="star star-empty"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success-100 text-success-800";
      case "rejected":
        return "bg-error-100 text-error-800";
      default:
        return "bg-warning-100 text-warning-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "hostaway":
        return "bg-primary-100 text-primary-800";
      case "google":
        return "bg-accent-100 text-accent-800";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  return (
    <div className="card p-6 hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">
              {review.reviewerName}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceColor(
                review.source
              )}`}
            >
              {review.source}
            </span>
            {showActions && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  review.status || "pending"
                )}`}
              >
                {review.status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{review.listingName}</p>
          <div className="rating-stars mb-2">
            {renderStars(review.rating)}
            <span className="ml-2 text-sm text-gray-600">
              ({review.rating}/10)
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {formatDate(review.submittedAt || new Date().toISOString())}
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

      {review.categories && review.categories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Category Ratings:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Array.isArray(review.categories) &&
              review.categories.map((category, index) => {
                const categoryObj =
                  typeof category === "object"
                    ? category
                    : { category: category, rating: 0 };
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600 capitalize">
                      {categoryObj.category?.replace("_", " ") || "Unknown"}
                    </span>
                    <span className="font-medium">
                      {categoryObj.rating || 0}/10
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {showActions && onStatusChange && onTogglePublic && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() =>
                onStatusChange(review._id || review.id || "", "approved")
              }
              className={`btn btn-sm ${
                review.status === "approved" ? "btn-success" : "btn-secondary"
              }`}
            >
              Approve
            </button>
            <button
              onClick={() =>
                onStatusChange(review._id || review.id || "", "rejected")
              }
              className={`btn btn-sm ${
                review.status === "rejected" ? "btn-error" : "btn-secondary"
              }`}
            >
              Reject
            </button>
          </div>
          <button
            onClick={() => onTogglePublic(review._id || review.id || "")}
            className={`btn btn-sm ${
              review.isPublic ? "btn-primary" : "btn-secondary"
            }`}
            disabled={review.status !== "approved"}
          >
            {review.isPublic ? "Public" : "Make Public"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
