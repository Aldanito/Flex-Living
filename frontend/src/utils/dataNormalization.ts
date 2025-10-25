import type { Review, DashboardStats, RawReview } from "../types/index";

export class DataNormalizer {
  static normalizeReview(review: RawReview): Review {
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
      approval: this.normalizeApproval(
        review.approval || { status: review.status }
      ),
    };
  }

  private static normalizeRating(rating: number | string): number {
    const num =
      typeof rating === "string" ? parseFloat(rating) : Number(rating);
    if (isNaN(num)) return 0;
    return Math.max(1, Math.min(5, Math.round(num)));
  }

  private static normalizeText(text: string): string {
    if (!text || typeof text !== "string") return "";
    return text.trim().replace(/\s+/g, " ");
  }

  private static normalizeName(name: string): string {
    if (!name || typeof name !== "string") return "Anonymous";
    return name.trim();
  }

  private static normalizeDate(date: string | number | Date): string {
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

  private static normalizeSource(source: string): "hostaway" | "google" {
    const normalized = source.toLowerCase().trim();
    return normalized === "google" ? "google" : "hostaway";
  }

  private static normalizeApproval(
    approval: Record<string, unknown>
  ): Review["approval"] {
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
      approvedBy:
        (approval.approvedBy as string) ||
        (approval.approved_by as string) ||
        null,
      approvedAt:
        (approval.approvedAt as string) ||
        (approval.approved_at as string) ||
        null,
    };
  }

  static normalizeDashboardStats(
    stats: Record<string, unknown>
  ): DashboardStats {
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
        (stats.ratingDistribution || stats.rating_distribution || {}) as Record<
          string,
          number
        >
      ),
      channelDistribution: this.normalizeChannelDistribution(
        (stats.channelDistribution ||
          stats.channel_distribution ||
          {}) as Record<string, number>
      ),
      listingStats: this.normalizeListingStats(
        (stats.listingStats || stats.listing_stats || {}) as Record<
          string,
          { count?: number; avgRating?: number; avg_rating?: number }
        >
      ),
      hostawayReviews: Number(
        stats.hostawayReviews || stats.hostaway_reviews || 0
      ),
      googleReviews: Number(stats.googleReviews || stats.google_reviews || 0),
      lastUpdated:
        (stats.lastUpdated as string) ||
        (stats.last_updated as string) ||
        new Date().toISOString(),
    };
  }

  private static normalizeRatingDistribution(
    distribution: Record<string, number>
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

  private static normalizeChannelDistribution(
    distribution: Record<string, number>
  ): {
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

  private static normalizeListingStats(
    stats: Record<
      string,
      { count?: number; avgRating?: number; avg_rating?: number }
    >
  ): {
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
          count: Number(value.count || 0),
          avgRating: Number(value.avgRating || value.avg_rating || 0),
        };
      }
    }
    return normalized;
  }
}

export class DataValidator {
  static validateReview(review: Record<string, unknown>): boolean {
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

  static validateDashboardStats(stats: Record<string, unknown>): boolean {
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

export class DataTransformer {
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
