import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { DashboardStats, Review, ReviewFilters } from "../types/index";
import apiService from "../services/api";
import { DashboardHeader } from "../components/DashboardHeader";
import { StatsCards } from "../components/StatsCards";
import { ReviewFilters as ReviewFiltersComponent } from "../components/ReviewFilters";
import { ReviewsTable } from "../components/ReviewsTable";
import { PropertyPerformanceTable } from "../components/PropertyPerformanceTable";
import { TrendAnalysis } from "../components/TrendAnalysis";
import { PropertyManagement } from "../components/PropertyManagement";
import { PropertyDetailsModal } from "../components/PropertyDetailsModal";
import {
  StarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<ReviewFilters>({
    limit: 50,
    offset: 0,
  });
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "reviews" | "properties" | "trends"
  >("reviews");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedPropertyName, setSelectedPropertyName] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsData] = await Promise.all([apiService.getDashboardStats()]);
      setStats(statsData);
    } catch (err: unknown) {
      console.error("Dashboard data loading error:", err);
      const errorMessage =
        (err as any).response?.data?.message || "Failed to load dashboard data";
      setError(errorMessage);

      // Set default stats if API fails
      setStats({
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        averageRating: 0,
        hostawayReviews: 0,
        googleReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        channelDistribution: {},
        listingStats: {},
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await apiService.getReviews(filters);
      setReviews(response.reviews);
      setTotalReviews(response.total);
      setHasMore(response.hasMore);
    } catch (err: unknown) {
      setError(
        (err as any).response?.data?.message || "Failed to load reviews"
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset offset when filters change
    }));
  };

  const handleBulkApprove = async (reviewIds: string[]) => {
    try {
      // Process bulk approval - in a real app, you'd have a bulk API endpoint
      for (const reviewId of reviewIds) {
        const review = reviews.find((r) => r.id === reviewId);
        if (review) {
          await apiService.approveReview(
            reviewId,
            review.listingId,
            review.source
          );
        }
      }
      loadReviews();
      loadDashboardData();
    } catch (err: unknown) {
      setError(
        (err as any).response?.data?.message || "Failed to bulk approve reviews"
      );
    }
  };

  const handleBulkUnapprove = async (reviewIds: string[]) => {
    try {
      // Process bulk unapproval
      for (const reviewId of reviewIds) {
        await apiService.unapproveReview(reviewId);
      }
      loadReviews();
      loadDashboardData();
    } catch (err: unknown) {
      setError(
        (err as any).response?.data?.message ||
          "Failed to bulk unapprove reviews"
      );
    }
  };

  const handleApproveReview = async (
    reviewId: string,
    listingId: string,
    source: string
  ) => {
    try {
      // Find the review to get its propertyId
      const review = reviews.find((r) => r.id === reviewId);
      const propertyId = review?.propertyId || listingId;
      await apiService.approveReview(reviewId, propertyId, source);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                approved: true,
                approval: {
                  isApproved: true,
                  approvedBy: "current_user", // You might want to get this from auth context
                  approvedAt: new Date().toISOString(),
                },
              }
            : review
        )
      );
      // Refresh reviews to ensure data consistency
      await loadReviews();
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleUnapproveReview = async (reviewId: string) => {
    try {
      await apiService.unapproveReview(reviewId);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                approved: false,
                approval: {
                  isApproved: false,
                  approvedBy: null,
                  approvedAt: null,
                },
              }
            : review
        )
      );
      // Refresh reviews to ensure data consistency
      await loadReviews();
    } catch (error) {
      console.error("Error unapproving review:", error);
    }
  };

  const handleLoadMore = () => {
    setFilters((prev) => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 50),
    }));
  };

  const handlePropertyClick = (propertyId: string, propertyName: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedPropertyName(propertyName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPropertyId("");
    setSelectedPropertyName("");
  };

  // Computed properties for better data analysis
  const propertyPerformance = useMemo(() => {
    if (!stats?.listingStats) return [];

    return Object.entries(stats.listingStats).map(([listingId, data]) => ({
      listingId,
      totalReviews: data.count,
      averageRating: data.avgRating,
      performance: (data.avgRating >= 4.5
        ? "excellent"
        : data.avgRating >= 4.0
        ? "good"
        : data.avgRating >= 3.0
        ? "average"
        : "poor") as "excellent" | "good" | "average" | "poor",
    }));
  }, [stats]);

  const trendData = useMemo(() => {
    if (!reviews.length) return null;

    // Group reviews by month for trend analysis
    const monthlyData = reviews.reduce((acc, review) => {
      const month = new Date(review.reviewDate).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, totalRating: 0, reviews: [] };
      }
      acc[month].count++;
      acc[month].totalRating += review.rating;
      acc[month].reviews.push(review);
      return acc;
    }, {} as Record<string, { count: number; totalRating: number; reviews: Review[] }>);

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        count: data.count,
        averageRating: data.totalRating / data.count,
        reviews: data.reviews,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [reviews]);

  const recurringIssues = useMemo(() => {
    if (!reviews.length) return [];

    // Simple keyword analysis for recurring issues
    const issueKeywords = [
      "noise",
      "clean",
      "location",
      "wifi",
      "heating",
      "water",
      "bed",
      "kitchen",
    ];
    const issueCounts = issueKeywords.reduce((acc, keyword) => {
      acc[keyword] = reviews.filter(
        (review) =>
          review.reviewText.toLowerCase().includes(keyword) && review.rating < 4
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(issueCounts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({ keyword: issue, count }));
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-screen flex-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#284E4C] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold flex-text">Loading Dashboard</h2>
          <p className="text-gray-600 mt-2">Preparing your insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-bg">
      <DashboardHeader user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 animate-slide-up">
            <div className="glass-card rounded-2xl p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-br from-[#284E4C] to-[#1a3a38] rounded-3xl p-12 text-center shadow-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              Review Management Dashboard
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Comprehensive insights and analytics for your property portfolio.
              Monitor performance, manage reviews, and drive guest satisfaction.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12 animate-slide-up">
          <nav className="flex justify-center space-x-2 bg-white/60 backdrop-blur-xl rounded-2xl p-2 shadow-xl">
            {[
              {
                id: "reviews",
                name: "Reviews",
                icon: StarIcon,
              },
              {
                id: "properties",
                name: "Properties",
                icon: BuildingOfficeIcon,
              },
              {
                id: "trends",
                name: "Trends",
                icon: ArrowTrendingUpIcon,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "reviews" | "properties" | "trends")
                  }
                  className={`${
                    isActive
                      ? "bg-[#284E4C] text-white shadow-lg transform scale-105"
                      : "text-black hover:text-[#284E4C] hover:bg-white/80"
                  } px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {stats && <StatsCards stats={stats} />}

              <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-[#284E4C] px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <StarIcon className="h-8 w-8 text-white" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Reviews Management
                      </h2>
                      <p className="text-white/80">
                        Manage and approve guest reviews for public display
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <ReviewFiltersComponent
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    totalReviews={totalReviews}
                  />

                  <div className="mt-8">
                    <ReviewsTable
                      reviews={reviews}
                      loading={reviewsLoading}
                      onApprove={handleApproveReview}
                      onUnapprove={handleUnapproveReview}
                      hasMore={hasMore}
                      onLoadMore={handleLoadMore}
                      onBulkApprove={handleBulkApprove}
                      onBulkUnapprove={handleBulkUnapprove}
                      onPropertyClick={handlePropertyClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#284E4C] to-[#1a3a38] px-8 py-6">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Property Performance
                    </h2>
                    <p className="text-white/80">
                      Comprehensive analytics for your property portfolio
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <PropertyPerformanceTable
                  propertyPerformance={propertyPerformance}
                  onPropertySelect={setSelectedProperty}
                  selectedProperty={selectedProperty}
                />
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#284E4C] to-[#1a3a38] px-8 py-6">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Property Management
                    </h2>
                    <p className="text-white/80">
                      Manage and approve properties from Hostaway
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <PropertyManagement />
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#284E4C] to-[#1a3a38] px-8 py-6">
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Trend Analysis
                    </h2>
                    <p className="text-white/80">
                      Discover patterns and insights in your review data
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <TrendAnalysis
                  trendData={trendData}
                  recurringIssues={recurringIssues}
                  stats={stats}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        propertyId={selectedPropertyId}
        propertyName={selectedPropertyName}
        reviews={reviews}
        onApprove={handleApproveReview}
        onUnapprove={handleUnapproveReview}
      />
    </div>
  );
};
