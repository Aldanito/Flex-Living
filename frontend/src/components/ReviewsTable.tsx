import React, { useState, useMemo } from "react";
import type { Review } from "../types/index";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ReviewsTableProps {
  reviews: Review[];
  loading: boolean;
  onApprove: (reviewId: string, listingId: string, source: string) => void;
  onUnapprove: (reviewId: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  onBulkApprove?: (reviewIds: string[]) => void;
  onBulkUnapprove?: (reviewIds: string[]) => void;
  onPropertyClick?: (propertyId: string, propertyName: string) => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({
  reviews,
  loading,
  onApprove,
  onUnapprove,
  hasMore,
  onLoadMore,
  onBulkApprove,
  onBulkUnapprove,
  onPropertyClick,
}) => {
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(
    new Set()
  );
  const [sortField, setSortField] = useState<keyof Review>("reviewDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort reviews based on current sort settings
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      let aValue: unknown = a[sortField];
      let bValue: unknown = b[sortField];

      // Handle different data types
      if (sortField === "reviewDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if ((aValue as number) < (bValue as number))
        return sortDirection === "asc" ? -1 : 1;
      if ((aValue as number) > (bValue as number))
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [reviews, sortField, sortDirection]);

  const handleSort = (field: keyof Review) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map((r) => r.id)));
    }
  };

  const handleSelectReview = (reviewId: string) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const handleBulkApprove = () => {
    if (onBulkApprove && selectedReviews.size > 0) {
      onBulkApprove(Array.from(selectedReviews));
      setSelectedReviews(new Set());
    }
  };

  const handleBulkUnapprove = () => {
    if (onBulkUnapprove && selectedReviews.size > 0) {
      onBulkUnapprove(Array.from(selectedReviews));
      setSelectedReviews(new Set());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Removed getRatingStars function - no longer using star icons

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "hostaway":
        return "bg-[#284E4C] text-white";
      case "google":
        return "bg-[#284E4C] text-white";
      default:
        return "bg-[#284E4C] text-white";
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flex-teal"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No reviews available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Sync Hostaway properties to fetch reviews, or try adjusting your
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedReviews.size > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-black">
                {selectedReviews.size} review
                {selectedReviews.size !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {onBulkApprove && (
                <button
                  onClick={handleBulkApprove}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#284E4C] hover:bg-[#1a3a38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#284E4C]"
                >
                  Approve All
                </button>
              )}
              {onBulkUnapprove && (
                <button
                  onClick={handleBulkUnapprove}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Unapprove All
                </button>
              )}
              <button
                onClick={() => setSelectedReviews(new Set())}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#284E4C]"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table
          className="min-w-full divide-y divide-gray-300"
          style={{ minWidth: "1200px" }}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    selectedReviews.size === reviews.length &&
                    reviews.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#284E4C] focus:ring-[#284E4C] border-gray-300 rounded"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("reviewerName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Review</span>
                  {sortField === "reviewerName" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("listingId")}
              >
                <div className="flex items-center space-x-1">
                  <span>Property</span>
                  {sortField === "listingId" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("rating")}
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  {sortField === "rating" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("source")}
              >
                <div className="flex items-center space-x-1">
                  <span>Source</span>
                  {sortField === "source" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("reviewDate")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === "reviewDate" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedReviews.has(review.id)}
                    onChange={() => handleSelectReview(review.id)}
                    className="h-4 w-4 text-[#284E4C] focus:ring-[#284E4C] border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {review.reviewerName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {review.reviewText.substring(0, 100)}
                      {review.reviewText.length > 100 && "..."}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {review.propertyName ? (
                      <button
                        onClick={() =>
                          onPropertyClick?.(
                            review.propertyId || review.listingId,
                            review.propertyName || "Unknown Property"
                          )
                        }
                        className="text-[#284E4C] hover:text-black hover:underline font-medium"
                      >
                        {review.propertyName}
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">
                        {review.listingId}
                      </span>
                    )}
                    {review.propertyAddress && (
                      <div className="text-xs text-gray-500 mt-1">
                        {review.propertyAddress}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {review.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadgeColor(
                      review.source
                    )}`}
                  >
                    {review.source}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(review.reviewDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {review.approval?.isApproved ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {review.approval?.isApproved ? (
                      <button
                        onClick={() => onUnapprove(review.id)}
                        className="text-black hover:text-gray-700 flex items-center space-x-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Unapprove</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          onApprove(review.id, review.listingId, review.source)
                        }
                        className="text-[#284E4C] hover:text-[#1a3a38] flex items-center space-x-1"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#284E4C] hover:bg-[#1a3a38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#284E4C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
