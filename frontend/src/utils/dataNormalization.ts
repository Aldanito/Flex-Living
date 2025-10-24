import type { Review, DashboardStats } from "../types/index";

/**
 * Data normalization utilities following DRY and SOLID principles
 * Single Responsibility: Each function has one clear purpose
 * Open/Closed: Easy to extend with new normalization rules
 * Dependency Inversion: Depends on abstractions (types) not concrete implementations
 */

export class DataNormalizer {
  /**
   * Normalize review data from various sources
   * Handles inconsistencies in data format from different APIs
   */
  static normalizeReview(review: any): Review {
    return {
      id: review.id || review.review_id || review._id || "",
      listingId:
        review.listingId || review.listing_id || review.property_id || "",
      channel: review.channel || review.platform || "unknown",
      rating: this.normalizeRating(
        review.rating || review.score || review.stars || 0
      ),
      reviewText: this.normalizeText(
        review.reviewText ||
          review.text ||
          review.comment ||
          review.content ||
          ""
      ),
      reviewerName: this.normalizeName(
        review.reviewerName ||
          review.author ||
          review.user_name ||
          review.name ||
          "Anonymous"
      ),
      reviewDate: this.normalizeDate(
        review.reviewDate ||
          review.date ||
          review.created_at ||
          review.timestamp ||
          new Date().toISOString()
      ),
      category: review.category || review.type || undefined,
      source: this.normalizeSource(
        review.source || review.origin || "hostaway"
      ),
      reviewerPhotoUrl:
        review.reviewerPhotoUrl ||
        review.avatar ||
        review.profile_picture ||
        undefined,
      reviewerUrl:
        review.reviewerUrl || review.profile_url || review.link || undefined,
      approval: this.normalizeApproval(review.approval || review.status || {}),
    };
  }

  /**
   * Normalize rating to ensure it's between 1-5
   */
  private static normalizeRating(rating: any): number {
    const num =
      typeof rating === "string" ? parseFloat(rating) : Number(rating);
    if (isNaN(num)) return 0;
    return Math.max(1, Math.min(5, Math.round(num)));
  }

  /**
   * Normalize text content
   */
  private static normalizeText(text: string): string {
    if (!text || typeof text !== "string") return "";
    return text.trim().replace(/\s+/g, " ");
  }

  /**
   * Normalize reviewer name
   */
  private static normalizeName(name: string): string {
    if (!name || typeof name !== "string") return "Anonymous";
    return name.trim();
  }

  /**
   * Normalize date to ISO string format
   */
  private static normalizeDate(date: any): string {
    if (!date) return new Date().toISOString();

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return new Date().toISOString();
      }
      return dateObj.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Normalize source to valid enum values
   */
  private static normalizeSource(source: string): "hostaway" | "google" {
    const normalized = source.toLowerCase().trim();
    return normalized === "google" ? "google" : "hostaway";
  }

  /**
   * Normalize approval status
   */
  private static normalizeApproval(approval: any): Review["approval"] {
    if (!approval || typeof approval !== "object") {
      return {
        isApproved: false,
        approvedBy: null,
        approvedAt: null,
      };
    }

    return {
      isApproved: Boolean(
        approval.isApproved ||
          approval.approved ||
          approval.status === "approved"
      ),
      approvedBy: approval.approvedBy || approval.approved_by || null,
      approvedAt: approval.approvedAt || approval.approved_at || null,
    };
  }

  /**
   * Normalize dashboard stats
   */
  static normalizeDashboardStats(stats: any): DashboardStats {
    return {
      totalReviews: Number(stats.totalReviews || stats.total_reviews || 0),
      approvedReviews: Number(
        stats.approvedReviews || stats.approved_reviews || 0
      ),
      pendingReviews: Number(
        stats.pendingReviews || stats.pending_reviews || 0
      ),
      averageRating: Number(stats.averageRating || stats.avg_rating || 0),
      ratingDistribution: this.normalizeRatingDistribution(
        stats.ratingDistribution || stats.rating_distribution || {}
      ),
      channelDistribution: this.normalizeChannelDistribution(
        stats.channelDistribution || stats.channel_distribution || {}
      ),
      listingStats: this.normalizeListingStats(
        stats.listingStats || stats.listing_stats || {}
      ),
      hostawayReviews: Number(
        stats.hostawayReviews || stats.hostaway_reviews || 0
      ),
      googleReviews: Number(stats.googleReviews || stats.google_reviews || 0),
      lastUpdated:
        stats.lastUpdated || stats.last_updated || new Date().toISOString(),
    };
  }

  /**
   * Normalize rating distribution
   */
  private static normalizeRatingDistribution(
    distribution: any
  ): DashboardStats["ratingDistribution"] {
    const defaultDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (!distribution || typeof distribution !== "object") {
      return defaultDist;
    }

    return {
      5: Number(distribution[5] || distribution.five || 0),
      4: Number(distribution[4] || distribution.four || 0),
      3: Number(distribution[3] || distribution.three || 0),
      2: Number(distribution[2] || distribution.two || 0),
      1: Number(distribution[1] || distribution.one || 0),
    };
  }

  /**
   * Normalize channel distribution
   */
  private static normalizeChannelDistribution(distribution: any): {
    [key: string]: number;
  } {
    if (!distribution || typeof distribution !== "object") {
      return {};
    }

    const normalized: { [key: string]: number } = {};
    for (const [key, value] of Object.entries(distribution)) {
      normalized[key] = Number(value) || 0;
    }
    return normalized;
  }

  /**
   * Normalize listing stats
   */
  private static normalizeListingStats(stats: any): {
    [key: string]: { count: number; avgRating: number };
  } {
    if (!stats || typeof stats !== "object") {
      return {};
    }

    const normalized: { [key: string]: { count: number; avgRating: number } } =
      {};
    for (const [key, value] of Object.entries(stats)) {
      if (value && typeof value === "object") {
        normalized[key] = {
          count: Number((value as any).count || 0),
          avgRating: Number(
            (value as any).avgRating || (value as any).avg_rating || 0
          ),
        };
      }
    }
    return normalized;
  }
}

/**
 * Data validation utilities
 */
export class DataValidator {
  /**
   * Validate review data structure
   */
  static validateReview(review: any): boolean {
    if (!review || typeof review !== "object") return false;

    const requiredFields = [
      "id",
      "listingId",
      "rating",
      "reviewText",
      "reviewerName",
      "reviewDate",
    ];
    return requiredFields.every(
      (field) => review[field] !== undefined && review[field] !== null
    );
  }

  /**
   * Validate dashboard stats structure
   */
  static validateDashboardStats(stats: any): boolean {
    if (!stats || typeof stats !== "object") return false;

    const requiredFields = [
      "totalReviews",
      "approvedReviews",
      "pendingReviews",
      "averageRating",
    ];
    return requiredFields.every(
      (field) => typeof stats[field] === "number" && !isNaN(stats[field])
    );
  }
}

/**
 * Data transformation utilities
 */
export class DataTransformer {
  /**
   * Transform reviews for display with computed properties
   */
  static transformReviewsForDisplay(reviews: Review[]): (Review & {
    displayDate: string;
    truncatedText: string;
    ratingStars: string;
    performanceCategory: "excellent" | "good" | "average" | "poor";
  })[] {
    return reviews.map((review) => ({
      ...review,
      displayDate: new Date(review.reviewDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      truncatedText:
        review.reviewText.length > 150
          ? review.reviewText.substring(0, 150) + "..."
          : review.reviewText,
      ratingStars: "⭐".repeat(review.rating),
      performanceCategory:
        review.rating >= 4.5
          ? "excellent"
          : review.rating >= 4.0
          ? "good"
          : review.rating >= 3.0
          ? "average"
          : "poor",
    }));
  }

  /**
   * Group reviews by property for performance analysis
   */
  static groupReviewsByProperty(reviews: Review[]): {
    [listingId: string]: Review[];
  } {
    return reviews.reduce((acc, review) => {
      if (!acc[review.listingId]) {
        acc[review.listingId] = [];
      }
      acc[review.listingId].push(review);
      return acc;
    }, {} as { [listingId: string]: Review[] });
  }

  /**
   * Calculate property performance metrics
   */
  static calculatePropertyPerformance(reviews: Review[]): {
    listingId: string;
    totalReviews: number;
    averageRating: number;
    approvedCount: number;
    pendingCount: number;
    performance: "excellent" | "good" | "average" | "poor";
  }[] {
    const grouped = this.groupReviewsByProperty(reviews);

    return Object.entries(grouped).map(([listingId, propertyReviews]) => {
      const totalReviews = propertyReviews.length;
      const averageRating =
        propertyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
      const approvedCount = propertyReviews.filter(
        (r) => r.approval?.isApproved
      ).length;
      const pendingCount = totalReviews - approvedCount;

      return {
        listingId,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        approvedCount,
        pendingCount,
        performance:
          averageRating >= 4.5
            ? "excellent"
            : averageRating >= 4.0
            ? "good"
            : averageRating >= 3.0
            ? "average"
            : "poor",
      };
    });
  }
}
